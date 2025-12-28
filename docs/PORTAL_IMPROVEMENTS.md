
# Client Portal: Suggested Improvements & Roadmap

To evolve the Client Portal from a text-based feed into a comprehensive command center for "High-Velocity Build Execution," the following features and architectural changes are recommended.

## 1. Visual Project Health Dashboard
**Current State:** Text-based updates.
**Proposal:** Implement a "Pulse" visualization.
*   **Metric Visualization:** Create charts for "Velocity," "Bug Rate," and "Budget Burn" using the existing `Recharts` or custom SVG components (similar to the Hero section animation).
*   **RAG Status:** Red/Amber/Green indicators for major milestones, auto-calculated based on the `confidence` level of recent updates.

## 2. Document Repository (The "Artifact Store")
**Current State:** No file persistence beyond the generated PDF.
**Proposal:** Connect the Portal to an R2 (Cloudflare Object Storage) bucket via the Worker.
*   **Feature:** Allow Associates to upload PDFs/Images to specific Update Cards.
*   **Feature:** Allow Clients to download signed contracts, architectural diagrams (Mermaid exports), and invoices directly from the portal.

## 3. "Live" Mode (Real-Time Sockets)
**Current State:** Polling/Manual Refresh.
**Proposal:** Implement Cloudflare Durable Objects for WebSocket connections.
*   **Benefit:** Clients see updates and comments appear instantly without refreshing.
*   **Presence:** Show who is currently viewing the portal (e.g., "Sunyata is typing...").

## 4. Enhanced Security
**Current State:** Basic JWT + Shared Secrets.
**Proposal:**
*   **MFA:** Implement Time-based One-Time Password (TOTP) for Admin/Associate accounts.
*   **Audit Logs:** Create an immutable log of who viewed which update and when (useful for "You didn't tell us X" disputes).

## 5. Interactive Decision Trees
**Current State:** Static "Decision" update cards.
**Proposal:** Interactive voting/approval mechanism.
*   **Action:** When a `decision` type update is posted, allow the Client to click "APPROVE" or "REQUEST REVISION" directly on the card.
*   **Audit:** This cryptographically signs the approval timestamp to the user's JWT.

## 6. The "Glitch" Theme Toggle
**Current State:** Global Light/Dark mode.
**Proposal:** A "Serious Mode" toggle for the portal specifically.
*   **Serious Mode:** Removes all "Neo-Brutalist" styling, turning the portal into a standard, boring Bootstrap-like corporate table view. Useful for clients who need to show updates to *their* bosses who might not appreciate the "Cyberpunk Lab" aesthetic.
