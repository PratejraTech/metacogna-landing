
import { z } from 'zod';

/**
 * API GATEWAY & ROUTER
 * --------------------
 * Central entry point for all frontend signals.
 * Routes based on `signal_type` in the JSON payload.
 */

// --- 1. Environment Configuration ---

export interface Env {
  HUBSPOT_TOKEN: string;
  HUBSPOT_PORTAL_ID: string;
  HUBSPOT_FORM_GUID: string;
  ALLOWED_ORIGIN?: string;
}

// Interface for Cloudflare Worker ExecutionContext
interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

// --- 2. Validation Schemas (Zod) ---

// Base Signal Schema
const BaseSignalSchema = z.object({
  signal_type: z.enum(['LEAD_SUBMISSION', 'TELEMETRY', 'ERROR_LOG']),
});

// Lead Submission Schema
const LeadSubmissionSchema = z.object({
  signal_type: z.literal('LEAD_SUBMISSION'),
  payload: z.object({
    email: z.string().email(),
    firstname: z.string().min(1),
    lastname: z.string().optional(),
    jobtitle: z.string().optional(),
    company: z.string().optional(),
    message: z.string().optional(),
    interest_level: z.string().optional(),
    requested_asset: z.string().optional(),
    context: z.object({
      pageUri: z.string().url().optional(),
      pageName: z.string().optional(),
      hutk: z.string().optional().nullable(),
    }).optional()
  })
});

type LeadSubmission = z.infer<typeof LeadSubmissionSchema>;

// --- 3. CORS Helper ---

function getCorsHeaders(env: Env, request: Request): HeadersInit {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigin = env.ALLOWED_ORIGIN || '*';
  // Strict origin check if ALLOWED_ORIGIN is set, otherwise strict echo or *
  const allow = allowedOrigin === '*' ? '*' : (origin === allowedOrigin ? origin : 'null');

  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// --- 4. Handlers ---

/**
 * Handler: LEAD_SUBMISSION
 * Submits validated data to HubSpot Forms API v3
 */
async function submitToHubSpot(data: LeadSubmission, env: Env): Promise<Response> {
  const { payload } = data;

  // Map to HubSpot Forms API v3 Fields
  const hubspotFields = [
    { name: 'email', value: payload.email },
    { name: 'firstname', value: payload.firstname },
    { name: 'lastname', value: payload.lastname || '' },
    { name: 'jobtitle', value: payload.jobtitle || '' },
    { name: 'company', value: payload.company || '' },
    { name: 'message', value: payload.message || '' },
    { name: 'interest_level', value: payload.interest_level || 'just_browsing' },
    { name: 'requested_asset', value: payload.requested_asset || '' }
  ];

  const hubspotPayload = {
    fields: hubspotFields,
    context: {
      pageUri: payload.context?.pageUri,
      pageName: payload.context?.pageName,
      hutk: payload.context?.hutk || undefined,
    }
  };

  // Using the correct Forms API v3 endpoint
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${env.HUBSPOT_PORTAL_ID}/${env.HUBSPOT_FORM_GUID}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.HUBSPOT_TOKEN}`
      },
      body: JSON.stringify(hubspotPayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`HubSpot API Error (${response.status}):`, errText);
      return new Response(JSON.stringify({ success: false, error: 'CRM_REJECTED', details: errText }), { status: 502 });
    }

    return new Response(JSON.stringify({ success: true, message: 'LEAD_CAPTURED' }), { status: 200 });

  } catch (error: any) {
    console.error('HubSpot Network Error:', error);
    return new Response(JSON.stringify({ success: false, error: 'NETWORK_ERROR' }), { status: 500 });
  }
}

// --- 5. Main Gateway Router ---

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const cors = getCorsHeaders(env, request);

    // Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Ensure POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), { 
        status: 405, 
        headers: { ...cors, 'Content-Type': 'application/json' } 
      });
    }

    try {
      const rawBody = await request.json();

      // 1. Initial Inspection: Check Signal Type
      const baseResult = BaseSignalSchema.safeParse(rawBody);
      
      if (!baseResult.success) {
        return new Response(JSON.stringify({ error: 'INVALID_SIGNAL_TYPE', details: baseResult.error }), {
          status: 400,
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }

      const signalType = baseResult.data.signal_type;
      let response: Response;

      // 2. Routing Logic
      switch (signalType) {
        case 'LEAD_SUBMISSION':
          // Validate specifically for Lead Submission
          const leadResult = LeadSubmissionSchema.safeParse(rawBody);
          if (!leadResult.success) {
             response = new Response(JSON.stringify({ error: 'INVALID_PAYLOAD', details: leadResult.error }), { status: 400 });
          } else {
             response = await submitToHubSpot(leadResult.data, env);
          }
          break;

        case 'TELEMETRY':
          // Placeholder for future Telemetry Handler
          // e.g. await ingestTelemetry(rawBody, env);
          response = new Response(JSON.stringify({ success: true, message: 'TELEMETRY_RECEIVED_MOCK' }), { status: 200 });
          break;

        case 'ERROR_LOG':
          // Placeholder for future Logger
          // console.warn('Frontend Error Logged:', rawBody);
          response = new Response(JSON.stringify({ success: true }), { status: 200 });
          break;

        default:
          response = new Response(JSON.stringify({ error: 'UNKNOWN_HANDLER' }), { status: 501 });
      }

      // Attach CORS to final response
      const newHeaders = new Headers(response.headers);
      Object.entries(cors).forEach(([k, v]) => newHeaders.set(k, v));
      newHeaders.set('Content-Type', 'application/json');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });

    } catch (err: any) {
      console.error('Gateway Logic Error:', err);
      return new Response(JSON.stringify({ error: 'INTERNAL_SERVER_ERROR' }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' }
      });
    }
  }
};
