---
name: Obsidian & Ivory
colors:
  surface: "#f9f9f9"
  surface-dim: "#dadada"
  surface-bright: "#f9f9f9"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f3f3f3"
  surface-container: "#eeeeee"
  surface-container-high: "#e8e8e8"
  surface-container-highest: "#e2e2e2"
  on-surface: "#1a1c1c"
  on-surface-variant: "#4c4546"
  inverse-surface: "#2f3131"
  inverse-on-surface: "#f1f1f1"
  outline: "#7e7576"
  outline-variant: "#cfc4c5"
  surface-tint: "#5e5e5e"
  primary: "#000000"
  on-primary: "#ffffff"
  primary-container: "#1b1b1b"
  on-primary-container: "#848484"
  inverse-primary: "#c6c6c6"
  secondary: "#5d5f5f"
  on-secondary: "#ffffff"
  secondary-container: "#dfe0e0"
  on-secondary-container: "#616363"
  tertiary: "#000000"
  on-tertiary: "#ffffff"
  tertiary-container: "#1b1c1c"
  on-tertiary-container: "#848484"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#e2e2e2"
  primary-fixed-dim: "#c6c6c6"
  on-primary-fixed: "#1b1b1b"
  on-primary-fixed-variant: "#474747"
  secondary-fixed: "#e2e2e2"
  secondary-fixed-dim: "#c6c6c7"
  on-secondary-fixed: "#1a1c1c"
  on-secondary-fixed-variant: "#454747"
  tertiary-fixed: "#e3e2e2"
  tertiary-fixed-dim: "#c7c6c6"
  on-tertiary-fixed: "#1b1c1c"
  on-tertiary-fixed-variant: "#464747"
  background: "#f9f9f9"
  on-background: "#1a1c1c"
  surface-variant: "#e2e2e2"
typography:
  display-xl:
    fontFamily: Bodoni Moda
    fontSize: 96px
    fontWeight: "700"
    lineHeight: 100px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 64px
    fontWeight: "600"
    lineHeight: 72px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 40px
    fontWeight: "600"
    lineHeight: 44px
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: "500"
    lineHeight: 40px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-mobile: 24px
  margin-desktop: 64px
  section-gap: 160px
---

## Brand & Style

The design system is rooted in the high-end editorial world, merging the precision of a modern art gallery with the tactile luxury of a prestige fashion magazine. It targets a discerning clientele in the photography and creative arts sectors, emphasizing the work as the primary focus through a strict "less is more" philosophy.

The visual style is **Minimalist** with a focus on **compositional tension**. It utilizes large blocks of negative space, razor-sharp edges, and deliberate asymmetry to create an atmosphere of quiet confidence and sophisticated restraint. The emotional response is one of exclusivity, clarity, and timelessness.

## Colors

The palette is strictly monochrome to ensure the photography remains the only source of hue.

- **Primary:** Deepest Black (#000000) for high-impact typography and structural lines.
- **Secondary:** Pure White (#FFFFFF) used for the primary canvas and negative space.
- **Neutral High:** Gainsboro and Light Grey (#F5F5F5) for subtle background shifts and container separation without breaking the minimalist flow.
- **Neutral Low:** Mid-range Greys (#757575) reserved for secondary metadata and disabled states.

Interactive states should never introduce color; instead, use opacity shifts or weight changes to signal engagement.

## Typography

The typographic system relies on a high-contrast pairing. **Bodoni Moda** provides the editorial "voice"—elegant, vertical, and commanding. It is used exclusively for headers and large quotes. **Inter** serves as the functional anchor, providing a neutral, highly legible sans-serif for body copy and UI elements.

- **Display & Headlines:** Should be set with tight tracking to emphasize the high-contrast strokes of the serif.
- **Body Copy:** Set with generous line height (1.5x - 1.8x) to maintain a feeling of airiness and luxury.
- **Labels:** Always capitalized with wide tracking (+10%) to function as architectural markers rather than just text.

## Layout & Spacing

The layout follows a **Fluid Grid** model with significant intentional breaks. While a 12-column structure exists for alignment, elements should frequently be offset to create an asymmetrical, "scanned magazine" look.

- **Negative Space:** Use `section-gap` between major content blocks to allow the eye to rest.
- **Asymmetry:** Align text to the left 4 columns while placing imagery in the right 6 columns, leaving the remaining space empty.
- **Mobile:** Transition to a single-column stack with reduced margins, but maintain the vertical spacing to preserve the premium feel.

## Elevation & Depth

This design system rejects traditional shadows. Depth is achieved through **Tonal Layers** and **Rigid Outlines**.

- **Surfaces:** Use flat, solid fills. High-tier elements (like modals) should use a stark 1px solid black border rather than a shadow.
- **Overlays:** For image lightboxes or navigation menus, use a 95% opaque white background to maintain a sense of physical layering without using blur or transparency.
- **Transitions:** Depth shifts are signaled by movement (e.g., a subtle 4px vertical slide) rather than lighting effects.

## Shapes

The shape language is strictly **Sharp (0px)**. All containers, buttons, and image frames must have 90-degree corners to reflect the precision of a printed photograph and the structural lines of a gallery space. Circular elements are permitted only for specific functional icons (e.g., a play button) but should be avoided for structural UI elements.

## Components

- **Buttons:** Rectangular with a 1px solid black border. On hover, the button fills solid black with white text. No transition easing—interaction should be instant and crisp.
- **Inputs:** A single 1px black line at the bottom. The label sits in `label-sm` style 8px above the line. Error states are indicated by a 2px stroke rather than a color change.
- **Navigation:** Minimalist text-only links. Use a strike-through or a weight change for the active state.
- **Cards:** No borders or shadows. The image takes 100% width, with typography placed either immediately below or slightly overlapping in a high-contrast treatment.
- **Chips/Tags:** Simple text surrounded by a thin rectangular border, using the `label-sm` typographic style.
- **Image Gallery:** Implement variable aspect ratios (mix of portrait and landscape) within the grid to reinforce the editorial aesthetic.
