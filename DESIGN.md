# Design System Document

## 1. Overview & Creative North Star: "The Editorial Hearth"

This design system is engineered to bridge the gap between high-end architectural publication and the accessible warmth of Peruvian family life. We move away from the clinical, "boxed-in" feel of standard real estate portals toward **The Editorial Hearth**—a creative North Star that treats every screen as a curated magazine spread.

The system breaks the rigid digital grid through intentional asymmetry, significant breathing room (whitespace), and a sophisticated interplay of vibrant energy and earthy stability. By utilizing overlapping elements and a dramatic typography scale, we transform a functional search into an emotional journey toward home ownership.

---

## 2. Colors: Tonal Depth & Vitality

The palette is a dialogue between the vibrant sun of Peru and the grounding earth tones of its landscape. 

### The Palette (Material Design Tokens)
*   **Primary (`#954a00`):** A sophisticated burnt orange, used for key actions and brand identity.
*   **Primary Container (`#ff8200`):** The "Vibrant Hearth" orange, to be used sparingly for high-impact visual interest.
*   **Secondary (`#6c5b55`):** A warm, stony brown that provides an authoritative, architectural anchor.
*   **Surface / Background (`#fcf9f6`):** A creamy, "fine-paper" off-white that avoids the harshness of pure hex white.

### The "No-Line" Rule
To maintain a high-end editorial aesthetic, **1px solid borders are strictly prohibited for sectioning.** Structural boundaries must be defined solely through:
1.  **Background Color Shifts:** Transitioning from `surface` to `surface-container-low`.
2.  **Tonal Transitions:** Using the `surface-variant` (`#e5e2df`) to denote content change.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine materials. 
- Use `surface-container-lowest` (`#ffffff`) for elevated cards.
- Use `surface-container` (`#f0edea`) for grouping related secondary information.
- Use `surface-container-highest` (`#e5e2df`) for recessed utility areas (like footer backgrounds or search bars).

### The "Glass & Gradient" Rule
For hero sections and floating navigation, use semi-transparent layers with a `backdrop-blur` of 20px. This allows the vibrant `primary` or warm `tertiary` tones to bleed through the UI, creating a sense of environmental depth. Main CTAs should utilize a subtle linear gradient from `primary` to `primary-container` at a 135-degree angle to provide "soul" and professional polish.

---

## 3. Typography: Manrope Editorial Scale

Manrope is our sole typeface. Its geometric precision combined with organic terminals makes it perfect for a "Popular Editorial" look.

*   **Display Large (3.5rem):** Reserved for hero headlines. Use with tight tracking (-0.02em) to create a bold, authoritative statement.
*   **Headline Medium (1.75rem):** Used for section titles. Ensure these have significant "air" (margin-bottom) to let the editorial content breathe.
*   **Body Large (1rem):** The standard for descriptive text. Line height must be generous (1.6) to ensure accessibility for families.
*   **Label Medium (0.75rem):** All-caps for metadata or category tags, paired with increased letter spacing (+0.05em) for a high-end architectural feel.

---

## 4. Elevation & Depth: Tonal Layering

We reject the "heavy shadow" era. Elevation is a whisper, not a shout.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. The slight delta in "creaminess" creates a natural lift.
*   **Ambient Shadows:** If a shadow is required (e.g., for a floating "Book Visit" button), use a 32px blur with 6% opacity. The shadow color should be a tinted version of `on-surface` (`#1c1c1a`), never pure black.
*   **The "Ghost Border" Fallback:** For input fields or cards that require containment on white backgrounds, use `outline-variant` (`#dec1af`) at **20% opacity**. This creates a "suggestion" of a boundary that feels premium.
*   **Roundedness:** All interactive elements and cards must utilize `ROUND_EIGHT` (`0.5rem`). This softens the architectural layout, making the brand feel approachable and friendly for families.

---

## 5. Components

### Buttons
*   **Primary:** `primary` background with `on-primary` text. `0.5rem` corner radius. 
*   **Secondary:** `secondary-container` background with `on-secondary-container` text.
*   **Interaction:** On hover, primary buttons should shift to a subtle gradient fill, never a flat color change.

### Cards (The Portfolio Unit)
Forbid the use of divider lines within cards. Use `1.4rem` (`spacing.4`) of vertical white space to separate the property title from the price. The card itself should have no border, using a `surface-container-lowest` fill to stand out against the page background.

### Input Fields
*   **Style:** Minimalist. No heavy borders. Use a `surface-variant` background with a `2px` bottom stroke in `outline` when focused.
*   **Error State:** Use `error` (`#ba1a1a`) for text and icons, but keep the container fill soft (`error_container`).

### Editorial Chips
Used for property features (e.g., "3 Habitaciones"). Use `secondary-fixed-dim` background with `on-secondary-fixed` text. This provides a warm, earthy tag that doesn't compete with the primary orange CTAs.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use asymmetrical margins. If a headline is left-aligned, try right-aligning the supporting body text to create editorial tension.
*   **DO** overlap images. Allow a property photo to slightly bleed over a background color change to create depth.
*   **DO** prioritize "Negative Space." If a layout feels crowded, remove a line and add 20px of padding.

### Don’t
*   **DON’T** use 100% black text. Always use `on-surface` (`#1c1c1a`) to maintain the "warm" editorial feel.
*   **DON’T** use standard 1px borders to separate content. It breaks the magazine-style flow.
*   **DON’T** use sharp 0px corners. This brand must feel safe and welcoming for families; keep everything at `ROUND_EIGHT` or higher.