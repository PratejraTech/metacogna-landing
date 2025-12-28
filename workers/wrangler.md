
# Wrangler Configuration for API Gateway

To deploy the new `gateway.ts` worker, ensure your `wrangler.toml` (in the project root) contains the following configuration.

This configuration defines the `metacogna-gateway` service, maps the build input to `workers/gateway.ts`, and defines the necessary environment variables.

```toml
name = "metacogna-gateway"
main = "workers/gateway.ts"
compatibility_date = "2024-03-20"

# --- Environment Variables (Public) ---
[vars]
# In production, set this to "https://metacogna.ai" to strictly enforce CORS
ALLOWED_ORIGIN = "http://localhost:5173"

# --- Secrets (Do Not Commit) ---
# Run the following commands to set these secrets in Cloudflare:
# wrangler secret put HUBSPOT_TOKEN
# wrangler secret put HUBSPOT_PORTAL_ID
# wrangler secret put HUBSPOT_FORM_GUID

# --- Observability ---
[observability]
enabled = true
```

## Deployment Instructions

1.  **Set Secrets:**
    ```bash
    wrangler secret put HUBSPOT_TOKEN
    wrangler secret put HUBSPOT_PORTAL_ID
    wrangler secret put HUBSPOT_FORM_GUID
    ```

2.  **Deploy:**
    ```bash
    wrangler deploy
    ```

3.  **Local Development:**
    To run locally with secrets, create a `.dev.vars` file in the project root:
    ```env
    HUBSPOT_TOKEN=your_token_here
    HUBSPOT_PORTAL_ID=your_id_here
    HUBSPOT_FORM_GUID=your_guid_here
    ALLOWED_ORIGIN=http://localhost:5173
    ```
    Then run:
    ```bash
    wrangler dev
    ```
