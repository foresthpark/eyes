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
shapes:
  border-radius-sm: 4px
  border-radius-md: 8px
  border-radius-lg: 12px
---

# Obsidian & Ivory

Canonical design system for the Eyes of Forest portfolio site and the Grain Issue / Double Tree client portal. One visual language everywhere: soft editorial monochrome with photography as the only source of hue.

Implementation lives in `client-portal/src/styles.css` (tokens), `client-portal/src/lib/ui.ts` (class recipes), and `client-portal/src/components/ui/*` (primitives).

## Brand principles

Rooted in the high-end editorial world: modern art gallery precision meets prestige fashion magazine restraint. Strict "less is more." Large negative space, softly rounded edges (editorial radius scale, never pill-shaped), deliberate asymmetry. Emotional tone: exclusivity, clarity, timelessness.

**Photography is the only source of color** for brand and chrome. Interactive states use opacity, weight, or tonal fills. Do not invent one-off hue for buttons, links, or decorative chrome.

**Exception: critical money status.** Paid / due / void (and equivalent payment callouts) may use the shared status tones (`success` green, `warning` amber, `danger` red, `neutral` grey) via `<StatusBadge>`, `<StatusCallout>`, and `<StatusPanel>` in `components/ui/status.tsx`. Always pair hue with icon + text. Do not scatter raw `bg-green-*` / `bg-amber-*` classes outside that module.

## Surface modes

Surface modes change **layout width and density only**. They share one visual language (soft cards, same radius scale, same tokens).

| Mode | Max width | Density | Typical pages |
|------|-----------|---------|---------------|
| Marketing (apex) | `max-w-6xl` | Airy section gaps (`section-gap`) | Landing, pricing, about, compare |
| Client portal | `max-w-2xl` to `max-w-3xl` (gallery up to `max-w-5xl` / `1152px`) | Intimate, photo-first | Portal home, board, schedule, gallery |
| Admin | `w-[80%]` denser stacks | Quiet studio ops desk | Pipeline, calendar, shoot detail, settings |
| Auth | `max-w-[448px]` centered card | Calm, exclusive | Login, signup |

## Tokens

### Colors (product CSS)

| Token | Hex | Use |
|-------|-----|-----|
| background | #f9f9f9 | Page canvas |
| foreground | #1a1c1c | Primary text |
| primary | #000000 | Filled buttons, headings accent |
| primary-foreground | #ffffff | Text on black |
| secondary | #5d5f5f | Metadata, subtitles |
| muted | #eeeeee | Subtle fills, progress track |
| card | #ffffff | Cards, sticky bars |
| outline / border | #7e7576 | Hairlines, dashed empty states |
| surface-container | #eeeeee | Hover fills, tonal layers |
| surface-container-high | #e8e8e8 | Elevated tonal fill |
| destructive | #ba1a1a | Errors, and the `danger` money-status tone |

Critical money status (see Components → Status) also uses soft green (`green-700`) and amber (`amber-700`) fills through the shared status module only.

### Typography

- **Bodoni Moda** (`font-display`): page titles, shoot names, prices, 404. Tight tracking. Scale: marketing `text-6xl`, admin `text-5xl`, client `text-4xl`, section `text-2xl`.
- **Inter** (`font-sans`): body, forms, metadata, admin tables.
- **Labels** (`label` recipe): uppercase, +10% letter-spacing. Architectural markers ("YOUR SHOOTS", "PHOTO SELECTION", nav).

### Spacing

8px unit. Mobile margin 24px (`px-margin-mobile`), desktop 64px (`px-margin`). Gutter 32px. Section gap 160px (`mt-section` / `py` section blocks). Sticky header 64px.

### Radius (editorial scale)

| Token | Size | Use |
|-------|------|-----|
| `rounded-sm` | 4px | Chips, tags, status badges |
| `rounded-md` | 8px | Buttons, inputs, small cards |
| `rounded-lg` / `rounded-xl` | 12px | Panels, modals, admin cards |

Never pill-shaped (`rounded-full`) on structural UI. Circles only for functional icons (avatar initials, play, lightbox heart).

## Elevation & depth

**One soft card system for all surfaces** (marketing, client, admin):

- Recipe: `rounded-xl border border-border/40 bg-card shadow-sm` (or `card` in `ui.ts` / `<Card>`)
- Hover: tonal fill (`bg-surface-container`) or light `shadow` bump. Never introduce hue.
- Hairline dividers: prefer `border-border/40` over hard `border-primary` grids.
- Overlays (modals, lightboxes, sticky chrome): white card or 95% opaque white layer.

**Photo overlays:** gradients are allowed **only** over photography to preserve text legibility, e.g. `bg-gradient-to-t from-black/70 via-black/40 to-black/30`. Do not use decorative gradient backgrounds on empty chrome.

## Components

### Button

Use `<Button>` from `components/ui/button.tsx`. Rectangular (`rounded-md`), uppercase label typography.

- **default:** black fill, white text, `hover:opacity-90`
- **outline:** hairline border, `hover:bg-surface-container`
- **ghost:** secondary text, `hover:text-primary`
- **destructive:** tonal destructive fill, never solid red chrome

Do not invent inline invert-hover buttons. Prefer `<Button>` over class recipes.

### Input

Use `<Input>` from `components/ui/input.tsx`:

| Variant | When |
|---------|------|
| `underline` | Client-facing forms (book, inquiry): bottom line only |
| `field` | Admin shoot/gallery forms: soft filled `rounded-lg border-border/40` |
| `default` | Compact shadcn-style fields |

Labels always visible in `label` / `fieldLabel` style. Errors: 2px destructive left border on the message, not a hue change on the input fill.

### Chip / Badge

Rectangular (`rounded-sm`), thin border or tonal monochrome fill. Use `chip` recipe or `<Badge>`. Pipeline and non-money status chips stay greyscale (surface / primary / accent / destructive tonal).

### Status (critical money only)

Shared primitives in `components/ui/status.tsx`:

| Primitive | Use |
|-----------|-----|
| `<StatusBadge tone icon>` | Paid / unpaid / invoice status chips |
| `<StatusCallout tone icon title detail action?>` | Standalone notices ("Paid in full", "Paying offline") |
| `<StatusPanel tone>` | Tinted row wrapper (deposit line, invoice row) |

| Tone | Meaning | Hue |
|------|---------|-----|
| `success` | Paid / cleared | Soft green |
| `warning` | Outstanding / offline / partial | Soft amber |
| `danger` | Unpaid / void | Destructive red |
| `neutral` | Draft / informational | Grey tonal |

Rules: icon + label required (never color alone). Prefer these primitives over ad-hoc `bg-green-*` / `bg-amber-*`. Do not use these hues for pipeline stages, nav, or non-money UI.

### Card

`<Card>` or `card` recipe: soft interactive tiles, generous padding, optional Bodoni title. Invert variant (`bg-primary text-primary-foreground`) for delivery panels only.

### Navigation

Text-only `label` links. Active / hover: strikethrough (`navLink` / `navLinkActive`). Sticky header: 64px, hairline bottom border (`border-border/40` or soft equivalent).

### Selection bar (proofing)

Sticky soft card (`selectionBar` recipe): progress track muted, fill primary. Submit = solid `<Button>`.

### Marketing sections

Prefer soft section shells (`marketingSection` recipe) or hairline `border-border/40` over hard black `border-primary` divide grids. Pricing cards may invert featured plan to primary fill.

### Pipeline / admin lists

Soft card stacks. Column headers: `label` + count. Drag-over: `bg-surface-container`. Empty states: muted text or dashed soft border, not an empty hard shell.

### Image gallery

Masonry with mixed aspect ratios. Lightbox: minimal chrome. Selected: filled heart icon (circle OK for icon hit target).

## Motion

Allowed: `transition-colors`, `transition-shadow`, subtle fade/slide (`fadeUp`), opacity. Forbidden: playful bounce, large scale transforms on structural UI, glassmorphism, glow.

## Do / Don't

**Do**

- Soft cards with `shadow-sm` and `border-border/40`
- Editorial radius scale (`rounded-sm` / `md` / `xl`)
- Photo gradient overlays for hero legibility
- `<Button>`, `<Card>`, `<Input>`, `<Badge>` for new work
- Monochrome tonal chips for pipeline and non-money status
- `<StatusBadge>` / `<StatusCallout>` / `<StatusPanel>` for paid / due / void

**Don't**

- Hard `border-primary` structural grids on new screens
- `rounded-full` on chips, badges, buttons, or cards
- Ad-hoc hue status colors outside `components/ui/status.tsx`
- Green/amber money hues on pipeline, nav, or decorative chrome
- Decorative gradient backgrounds on empty chrome
- Glassmorphism or heavy `shadow-lg` as default elevation
- Sidebar nav for client portal (top nav only)
- Password fields (magic link / OTP only)

## Code mapping

| Spec | Code |
|------|------|
| Tokens / radius | `client-portal/src/styles.css` |
| `label`, `chip`, `card`, `input`, `navLink`, `fieldLabel`, `cardTitle`, `selectionBar`, `marketingSection` | `client-portal/src/lib/ui.ts` |
| Button | `client-portal/src/components/ui/button.tsx` |
| Input variants | `client-portal/src/components/ui/input.tsx` |
| Card | `client-portal/src/components/ui/card.tsx` |
| Badge | `client-portal/src/components/ui/badge.tsx` |
| Critical money status | `client-portal/src/components/ui/status.tsx` (`StatusBadge`, `StatusCallout`, `StatusPanel`) |

## Client portal appendix

Product context for Grain Issue / studio-branded portals:

- **Apex** (`grainissue.com`): product marketing under Grain Issue brand.
- **Tenant** (`{slug}.grainissue.com` or custom domain): studio front door + portal. Studio logo/name lead; Grain Issue stays quiet.
- Wordmark: studio name or product name in Bodoni uppercase. No separate logo mark required.
- Auth: magic link / email OTP only.
- Currency: CAD by default (studio-configurable).
- Tone: first person from photographer where client-facing; spare, editorial, not corporate SaaS.
- Accessibility: WCAG AA contrast; errors use border weight + text; touch targets ≥44px on gallery actions; labels always visible.

Reference implementations (soft system): login, signup, book, studio landing, portal home, schedule, pipeline.
