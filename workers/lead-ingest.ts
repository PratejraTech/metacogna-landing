

/**
 * WORKER: Lead Ingestion Gateway & Dispatcher
 * PURPOSE: Sanitize public form data and dispatch to HubSpot CRM + Make.com automation.
 * 
 * ENV VARS:
 * - HUBSPOT_TOKEN: Private App Token
 * - HUBSPOT_PORTAL_ID: HubSpot Portal ID
 * - HUBSPOT_FORM_GUID: HubSpot Form GUID
 * - MAKE_WEBHOOK_URL: (Optional) Make.com webhook URL
 * - ALLOWED_ORIGIN: (Optional) Limit CORS to specific domain
 */

export interface Env {
  HUBSPOT_TOKEN: string;
  HUBSPOT_PORTAL_ID: string;
  HUBSPOT_FORM_GUID: string;
  MAKE_WEBHOOK_URL?: string;
  ALLOWED_ORIGIN?: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

interface LeadPayload {
  name: string;
  email: string;
  interest: 'just_browsing' | 'ready_to_build' | 'crisis_mode';
  position: string;
  objective?: string;
  requestedAsset?: string;
  
  // Context Data for HubSpot
  pageUri?: string;
  pageName?: string;
  hutk?: string | null; // HubSpot Cookie
  
  // Security
  bot_check?: string;
}

// --- CORS HELPERS ---

function corsHeaders(env: Env, request: Request): HeadersInit {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigin = env.ALLOWED_ORIGIN || '*';
  
  // Should allow specific origin or fallback to *
  const allow = allowedOrigin === '*' ? '*' : (origin === allowedOrigin ? origin : 'null');

  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// --- VALIDATION UTILS ---

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeInput(str: string): string {
  if (!str) return '';
  return str.replace(/[<>]/g, '').trim().slice(0, 1000);
}

// --- WORKER HANDLER ---

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const headers = corsHeaders(env, request);

    // 1. Handle Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    // 2. Only allow POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    try {
      const contentType = request.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return new Response(JSON.stringify({ error: 'Invalid content type' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      const body = await request.json() as LeadPayload;

      // 3. Honeypot Check
      if (body.bot_check && body.bot_check.length > 0) {
        console.warn('BOT_DETECTED: Honeypot triggered');
        return new Response(JSON.stringify({ status: 'ok' }), { 
          status: 200, 
          headers: { ...headers, 'Content-Type': 'application/json' } 
        });
      }

      // 4. Validation
      const cleanEmail = body.email ? body.email.trim() : '';
      const cleanName = sanitizeInput(body.name);

      if (!cleanEmail || !isValidEmail(cleanEmail)) {
        return new Response(JSON.stringify({ error: 'Valid Email is required' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      // 5. Construct HubSpot Payload (Forms API v3)
      // Doc: https://legacydocs.hubspot.com/docs/methods/forms/submit_form_v3
      const hubspotPayload = {
        fields: [
          { name: 'email', value: cleanEmail },
          { name: 'firstname', value: cleanName },
          { name: 'jobtitle', value: sanitizeInput(body.position || '') },
          { name: 'message', value: sanitizeInput(body.objective || '') }, // Mapping objective to standard message/comment
          { name: 'interest_level', value: body.interest }, // Ensure this property exists in HubSpot or rename
          { name: 'requested_asset', value: body.requestedAsset || 'metacogna_prospectus' }
        ],
        context: {
          pageUri: body.pageUri || 'https://metacogna.ai',
          pageName: body.pageName || 'MetaCogna Landing',
          hutk: body.hutk || undefined,
        },
        // Legal consent options can be added here if needed
      };

      // 6. Dispatch to Make.com (Fire & Forget)
      if (env.MAKE_WEBHOOK_URL) {
        const makePayload = {
          ...body,
          ingested_at: new Date().toISOString(),
          source: 'metacogna_worker',
        };
        
        ctx.waitUntil(
          fetch(env.MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(makePayload)
          }).catch(err => console.error('Make.com Dispatch Error:', err))
        );
      }

      // 7. Dispatch to HubSpot (Await response for integrity)
      if (env.HUBSPOT_PORTAL_ID && env.HUBSPOT_FORM_GUID && env.HUBSPOT_TOKEN) {
        const hubspotUrl = `https://api.hubapi.com/submissions/v3/integration/submit/${env.HUBSPOT_PORTAL_ID}/${env.HUBSPOT_FORM_GUID}`;
        
        const hsResponse = await fetch(hubspotUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.HUBSPOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(hubspotPayload),
        });

        if (!hsResponse.ok) {
          const text = await hsResponse.text();
          console.error('HubSpot Error:', hsResponse.status, text);
          // We return a 500 but also log it. 
          // Note: In production, you might want to return 200 to client if Make.com succeeded, 
          // but for now we want to know if HubSpot fails.
          return new Response(JSON.stringify({ ok: false, error: 'CRM Submission Failed', detail: text }), {
            status: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
          });
        }
      } else {
        console.warn('HubSpot Configuration Missing in Env');
      }

      // 8. Success
      return new Response(JSON.stringify({ ok: true, message: 'Lead Ingested' }), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

    } catch (err: any) {
      console.error('Worker Critical Error:', err);
      return new Response(JSON.stringify({ ok: false, error: 'Internal System Error' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};