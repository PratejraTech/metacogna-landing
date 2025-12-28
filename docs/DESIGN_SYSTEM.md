
# MetaCogna.AI // Design System Specification v1.0

## 1. Core Philosophy: "Digital Paper" & "Functional Brutalism"
The design system operates on the metaphor of **Digital Paper**. Elements are not floating in a void; they are physical sheets of paper layered on top of a surface. 

**Key Rules:**
1.  **Hard Edges:** No `border-radius` greater than `2px`. We do not smooth corners; we embrace the grid.
2.  **Hard Shadows:** No blurred drop-shadows. Shadows are solid blocks of color (`box-shadow: 4px 4px 0px 0px color`). This implies a physical light source and tangible stack depth.
3.  **High Contrast:** The UI relies on strict polarity between **Ink** (Dark) and **Paper** (Light).
4.  **Visible Construction:** We show the "screws". Metadata, IDs, and technical labels (e.g., `DOC_ID: PRD-2025`) are visible UI elements, not hidden attributes.

---

## 2. Color Palette (The "Ink & Paper" System)

We use Semantic naming rather than color naming.

| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| **Ink** | `#18181b` (Zinc 950) | Primary text, borders, hard shadows, backgrounds for terminal windows. |
| **Paper** | `#ffffff` (White) | Cards, modals, primary backgrounds in light mode. |
| **Surface** | `#f4f4f5` (Zinc 100) | The "desk" background behind the paper cards. Slightly off-white to create depth. |
| **Accent** | `#10b981` (Emerald 500) | Success states, "Go" buttons, terminal cursors, high-value highlights. |
| **Warning** | `#ef4444` (Red 500) | Errors, "Delete" actions, critical alerts. |

**Dark Mode Inversion:**
In Dark Mode, **Ink** becomes `#f4f4f5` and **Paper** becomes `#18181b`. The logic remains the same (High Contrast), but the polarity flips.

---

## 3. Typography (The "Trifecta")

We use three distinct typefaces to separate **Narrative**, **Utility**, and **Data**.

### A. The Voice of Authority (Serif)
*   **Font:** `Playfair Display`
*   **Usage:** H1, H2, H3, Hero statements, "Philosophy" sections.
*   **Vibe:** Classic, editorial, serious, slightly arrogant.
*   **Styling:** Bold weights, tight tracking (`tracking-tight`).

### B. The Voice of Utility (Sans-Serif)
*   **Font:** `Inter`
*   **Usage:** Body text, long-form reading, button labels.
*   **Vibe:** Invisible, highly legible, modern.
*   **Styling:** Standard weights, generous line-height (`leading-relaxed`) for readability.

### C. The Voice of the Machine (Monospace)
*   **Font:** `JetBrains Mono`
*   **Usage:** Metadata tags, IDs (`ID: 2025-X`), Terminal output, footnotes, navigation links, technical specs.
*   **Vibe:** Raw data, code, truth, engineering.
*   **Styling:** Uppercase often (`uppercase`), smaller size (`text-xs`), widely tracked (`tracking-widest`).

---

## 4. Component Physics & Patterns

### The `PaperCard`
The fundamental building block.
*   **Border:** `2px solid var(--color-ink)`
*   **Shadow:** `4px 4px 0px 0px var(--color-ink)`
*   **Hover State:** Translate Y `-1px`, Shadow increases to `6px 6px`.
*   **Bg:** `var(--color-paper)`

### The `PaperButton`
*   **Primary:** Solid Ink background, Paper text. Inverts on hover to Accent background.
*   **Ghost:** Transparent background, Ink text. On hover, gains a hard shadow.
*   **Interaction:** On `active` (click), the element translates `2px 2px` down to "crush" the shadow, simulating a physical button press.

### The `BlueprintSchematic` (SVG)
*   **Lines:** Thin `1.5px` strokes.
*   **Colors:** Cyan/Blue (`#38bdf8`) on Dark Blue (`#0f172a`) background.
*   **Motion:** Particles travel along `offset-path` SVG lines to simulate data flow.
*   **Logic:** Always connect Input -> Process -> Output.

### The "Terminal" Overlay
Used for high-density technical information or "loading" states.
*   **Bg:** Black (`#000000`) or Ink (`#18181b`).
*   **Text:** Bright Green (`#22c55e`) or Accent.
*   **Font:** Monospace.
*   **Animation:** Typing effects, blinking cursors.

---

## 5. Layout & Spacing
*   **Grid:** We use a fluid 12-column grid.
*   **Spacing:** Generous padding inside cards (`p-6` or `p-8`). Tight spacing between "grouped" data elements (`gap-2`).
*   **Whitespace:** Used aggressively to separate "Narrative" sections from "Technical" sections.

## 6. Iconography
*   **Set:** Lucide React.
*   **Style:** `stroke-width={1.5}` or `2`. Sharp, clean lines match the border aesthetics.
*   **Usage:** Icons are rarely used alone; they are usually paired with a Monospace label.
