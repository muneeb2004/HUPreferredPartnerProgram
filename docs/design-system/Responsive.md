# Responsive Design Strategy

> Mobile-first, content-driven — every breakpoint is a design decision, not a compromise.

---

## Philosophy

Responsive design is not about shrinking desktop layouts. Every breakpoint is a deliberate design moment. Content hierarchy, typography, spacing, and interaction patterns are re-evaluated at each tier. We start from the smallest screen and layer complexity upward — nothing is an afterthought.

---

## Breakpoint System

Aligned with Tailwind CSS defaults. All styles are authored mobile-first.

| Name  | Min-Width | CSS Media Query             | Target Context                   |
| ----- | --------- | --------------------------- | -------------------------------- |
| base  | `0px`     | (default)                   | Small phones (320–639px)         |
| `sm`  | `640px`   | `@media (min-width: 640px)` | Large phones, small tablets      |
| `md`  | `768px`   | `@media (min-width: 768px)` | Tablets (portrait)               |
| `lg`  | `1024px`  | `@media (min-width: 1024px)`| Tablets (landscape), laptops     |
| `xl`  | `1280px`  | `@media (min-width: 1280px)`| Desktops                         |
| `2xl` | `1536px`  | `@media (min-width: 1536px)`| Large desktops, ultrawide        |

> [!IMPORTANT]
> Never use arbitrary breakpoints. If a component needs a custom break, reconsider the design — not the breakpoint system.

---

## Responsive Typography Scale

Type sizes fluidly adjust across breakpoints. Body text remains legible at every size; headings scale more aggressively.

| Token          | Mobile (base) | Tablet (`md`) | Desktop (`lg+`) |
| -------------- | ------------- | ------------- | --------------- |
| `text-display` | `36px / 1.1`  | `48px / 1.05` | `64px / 1.0`    |
| `text-h1`      | `30px / 1.15` | `36px / 1.1`  | `48px / 1.05`   |
| `text-h2`      | `24px / 1.2`  | `30px / 1.15` | `36px / 1.15`   |
| `text-h3`      | `20px / 1.3`  | `24px / 1.25` | `28px / 1.2`    |
| `text-body`    | `16px / 1.6`  | `16px / 1.6`  | `18px / 1.6`    |
| `text-small`   | `14px / 1.5`  | `14px / 1.5`  | `14px / 1.5`    |
| `text-caption` | `12px / 1.4`  | `12px / 1.4`  | `13px / 1.4`    |

> [!TIP]
> Use CSS `clamp()` for fluid headings where appropriate: `font-size: clamp(1.875rem, 4vw, 3rem)`. Reserve fixed steps for body and caption text.

---

## Responsive Spacing Adjustments

Spacing tokens compress on smaller screens to prevent excessive whitespace on mobile.

| Token              | Mobile  | Tablet (`md`) | Desktop (`lg+`) |
| ------------------ | ------- | ------------- | --------------- |
| `section-gap`      | `48px`  | `64px`        | `96px`          |
| `component-gap`    | `24px`  | `32px`        | `40px`          |
| `card-padding`     | `16px`  | `20px`        | `24px`          |
| `page-margin`      | `16px`  | `32px`        | `48px`          |

---

## Layout Shift Strategies

- **Stack on mobile** — Multi-column layouts collapse to single column below `md`.
- **Reorder with intent** — Use `order` utilities to place the most important content first on mobile, even if it appears second on desktop.
- **Hide decorative elements** — Ornamental imagery, background patterns, and non-essential UI chrome are hidden below `lg` via `hidden lg:block`.
- **Sidebar becomes drawer** — Sidebar navigation converts to a slide-out drawer below `lg`.

---

## Touch Target Minimums

All interactive elements must meet minimum touch target sizes on touch devices.

| Element             | Minimum Size | Minimum Spacing |
| ------------------- | ------------ | --------------- |
| Buttons             | `44 × 44px`  | `8px` gap       |
| Icon buttons        | `44 × 44px`  | `8px` gap       |
| Links (inline)      | `44px` height | —               |
| Form inputs         | `44px` height | `12px` gap      |
| Checkbox / Radio    | `44 × 44px`  | `8px` gap       |

> [!WARNING]
> Touch targets smaller than 44×44px are an accessibility failure. Test every interactive element on real touch devices.

---

## Responsive Component Behavior

| Component        | Mobile                          | Tablet                    | Desktop                      |
| ---------------- | ------------------------------- | ------------------------- | ---------------------------- |
| Navigation       | Hamburger → drawer              | Condensed horizontal      | Full horizontal nav          |
| PartnerCard      | Full-width, stacked             | 2-column grid             | 3–4 column grid              |
| FilterBar        | Collapsed into bottom sheet     | Horizontal, scrollable    | Full inline row              |
| HeroSection      | Stacked, image below text       | Side-by-side 50/50        | Asymmetric 7/5 split         |
| StatsCounter     | 2×2 grid                        | Inline row                | Inline row with spacing      |
| Dialog           | Full-screen sheet               | Centered modal (480px)    | Centered modal (560px)       |

---

## Image Responsive Strategy

### srcset & sizes

Every content image must declare `srcset` and `sizes` to serve appropriately sized assets.

```html
<Image
  src="/partners/logo.webp"
  srcSet="/partners/logo-400.webp 400w, /partners/logo-800.webp 800w, /partners/logo-1200.webp 1200w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Partner logo"
/>
```

### Art Direction

For hero images and editorial layouts, use the `<picture>` element with distinct crops per breakpoint — don't just scale the same image.

### Format Priority

Serve `WebP` with `AVIF` as progressive enhancement. JPEG/PNG as fallback only.

---

## Responsive Animation

Animation behavior adapts to device capability and user preference.

| Concern                   | Rule                                                      |
| ------------------------- | --------------------------------------------------------- |
| `prefers-reduced-motion`  | Disable all non-essential animation. Transitions → instant. |
| Mobile (`< md`)           | Reduce parallax intensity by 50%. Disable 3D scenes.      |
| Scroll animations         | Simplify to fade-in only on mobile. Full choreography on `lg+`. |
| Three.js / R3F scenes     | Load conditionally — skip on devices with < 4GB RAM or mobile. |
| Page transitions          | Keep to opacity crossfade on mobile. Full transitions on desktop. |

```js
// Detect reduced motion preference
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Conditional Lenis smooth scroll
if (!prefersReduced) {
  const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
}
```

> [!NOTE]
> Respecting `prefers-reduced-motion` is not optional. It is a core accessibility requirement and is enforced in our quality checklist.
