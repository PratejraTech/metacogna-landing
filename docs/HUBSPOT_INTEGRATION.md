
# Technical Architecture: HubSpot Integration

This document outlines how the **HubspotTerminal** component connects to the HubSpot CRM to capture leads and trigger the PDF Prospectus download.

## 1. The User Flow
1.  **Trigger:** User opens the "HubSpot Terminal" (via "Email Lab" footer link or "Escape Protocol" anchor).
2.  **Input:** User enters Name, Email, and Interest Level in a CLI-styled form.
3.  **Action:** User clicks `[ TRANSMIT_DATA ]`.
4.  **Feedback:** 
    *   Button shows `ESTABLISHING UPLINK...` (Processing state).
    *   Terminal logs appear: `PAYLOAD DISPATCHED`, `PDF GENERATION TRIGGERED`.
5.  **Outcome:** 
    *   Data is sent to HubSpot.
    *   `generateProspectusPDF()` function fires client-side, downloading the file.
    *   Form resets.

## 2. Architecture Diagram

```mermaid
graph LR
    Client[React Client] -->|POST Payload| Worker[Cloudflare Worker]
    Worker -->|Validate| Worker
    Worker -->|POST Form Submission| HubSpot[HubSpot Forms API]
    HubSpot -->|200 OK| Worker
    Worker -->|200 OK| Client
    Client -->|On Success| PDF[Generate PDF (jsPDF)]
```

## 3. Implementation Details

### A. Frontend (`HubspotTerminal.tsx`)
Currently, the frontend uses a `setTimeout` to mock the network request. To go live, replace the timeout with a `fetch` call.

**Payload Structure:**
```json
{
  "fields": [
    { "name": "email", "value": "user@example.com" },
    { "name": "firstname", "value": "Agent Smith" },
    { "name": "interest_level", "value": "ready_to_build" }, // Custom Property
    { "name": "requested_asset", "value": "Prospectus_PDF_2025" }
  ],
  "context": {
    "pageUri": "www.metacogna.ai",
    "pageName": "MetaCogna Lab Landing"
  }
}
```

### B. Backend (Cloudflare Worker)
We do not expose the HubSpot Portal ID or Form GUID directly in the client code to avoid spam. The Worker acts as a proxy.

**Route:** `POST /api/submit-lead`

**Worker Logic:**
1.  Receive JSON payload.
2.  Validate Email format.
3.  Forward request to HubSpot Forms API v3:
    *   `https://api.hsforms.com/submissions/v3/integration/submit/:portalId/:formGuid`
4.  Handle HubSpot errors (e.g., duplicate contact).
5.  Return JSON response to React Client.

### C. HubSpot Configuration
1.  **Create a Form:** Create a "Lead Capture" form in HubSpot.
    *   Fields: First Name, Email, Interest Level (Dropdown).
2.  **Get IDs:** Note the `Portal ID` and `Form GUID`.
3.  **Environment Variables:** Store these in the Cloudflare Worker environment (`wrangler.toml`).

## 4. PDF Generation Hook
The PDF generation is decoupled from the HubSpot API success for user experience (we give them the PDF even if the API fails, usually), but ideally, it is chained to the success event.

*   **File:** `services/pdfGenerator.ts`
*   **Library:** `jspdf`
*   **Logic:** Generates a vector-based PDF on the fly using the current data in `profile.ts`. This ensures the PDF is always up-to-date with the website content.

## 5. Security & Anti-Spam
1.  **Honeypot:** The Worker should implement a hidden field check or Cloudflare Turnstile integration to prevent bot submissions.
2.  **Rate Limiting:** The Worker should limit submissions from a single IP address.
