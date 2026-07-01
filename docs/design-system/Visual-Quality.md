# Visual Quality Standards

> Ship nothing that wouldn't belong in a museum — every pixel is intentional, every motion is earned.

---

## Transition Standards

Not everything should animate. Transitions are reserved for elements where motion communicates meaning or improves perceived performance.

### What Animates

| Element                  | Property              | Duration    | Easing                     |
| ------------------------ | --------------------- | ----------- | -------------------------- |
| Button hover/active      | `background`, `scale` | `150ms`     | `ease-out`                 |
| Card hover elevation     | `box-shadow`, `transform` | `200ms` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Link underline           | `width`, `opacity`    | `200ms`     | `ease-out`                 |
| Modal enter              | `opacity`, `transform`| `250ms`     | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Modal exit               | `opacity`, `transform`| `150ms`     | `ease-in`                  |
| Page transition          | `opacity`, `transform`| `400ms`     | `cubic-bezier(0.4, 0, 0, 1)` |
| Scroll reveal            | `opacity`, `transform`| `600ms`     | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Tab indicator            | `left`, `width`       | `250ms`     | `ease-in-out`              |

### What Does NOT Animate

- Layout reflows (`width`, `height`, `margin`, `padding`)
- Color theme switches (instant)
- Text content changes
- Skeleton-to-content transitions (crossfade only)
- Scroll position changes (handled by Lenis, not CSS)

---

## Micro-Interaction Catalog

### Hover States

| Element          | Behavior                                                      |
| ---------------- | ------------------------------------------------------------- |
| Buttons          | Slight darkening (primary) or background fill (ghost). `scale(0.98)` on press. |
| Cards            | Elevation shift from `sm` → `md`. Subtle `translateY(-2px)`.  |
| Links            | Underline animates from left. Color shifts to `primary`.       |
| Brand logos       | Grayscale → full color. `filter` transition over `300ms`.     |
| Icon buttons     | Background circle fades in. Scale `1 → 1.05` on hover.        |

### Focus Rings

All focusable elements display a `2px` ring using the `ring-primary` token with `ring-offset-2`. The ring appears only on keyboard focus (`:focus-visible`), never on click.

```css
.focus-ring {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2;
}
```

### Loading States

- **Skeleton screens** — Used for initial page/component loads. Match exact component dimensions.
- **Inline spinners** — 16px spinner inside buttons during async actions. Button text replaced.
- **Progress bars** — Used for multi-step processes (forms, uploads). Thin bar at page top for route changes.
- **Optimistic updates** — Apply state changes immediately, revert on error.

### Success & Error Feedback

| State   | Visual Treatment                                              |
| ------- | ------------------------------------------------------------- |
| Success | Green checkmark icon + brief toast (auto-dismiss 3s). Subtle `scale` entrance. |
| Error   | Red inline message below input + border color shift. Toast for global errors. |
| Warning | Amber badge/banner. Persistent until acknowledged.            |
| Info    | Neutral toast, auto-dismiss 5s.                               |

---

## Motion Hierarchy

Motion intensity is proportional to the scope of the change. Larger changes earn more dramatic motion.

```
Level 1: Page Transitions (highest)
  ├── Full-page crossfade + subtle slide
  ├── Duration: 400ms
  └── Managed by Next.js + Framer Motion

Level 2: Scroll Reveals
  ├── Elements animate in as they enter viewport
  ├── Duration: 600ms, staggered 80ms between siblings
  └── Managed by GSAP ScrollTrigger

Level 3: Component Animations
  ├── Modal enter/exit, accordion expand, tab switch
  ├── Duration: 200–300ms
  └── Managed by Framer Motion (AnimatePresence)

Level 4: Micro-Interactions (lowest)
  ├── Hover, focus, press feedback
  ├── Duration: 100–200ms
  └── Managed by CSS transitions
```

> [!IMPORTANT]
> Never let a micro-interaction (Level 4) be more visually prominent than a scroll reveal (Level 2). The hierarchy must be felt, not just defined.

---

## Editorial Layout Patterns

### Magazine-Style Grids
Mix column spans within a single grid to create visual rhythm. Alternate between full-width features and multi-column listings. No two consecutive rows should have identical column structures.

### Pull Quotes
Typographic highlight blocks that break out of the body column. Set at `text-h2` scale, use `font-serif`, span 8 columns in a 12-column grid. Generous vertical padding (`64px` top and bottom).

### Full-Bleed Images
Images that span edge-to-edge, breaking out of the container. Always paired with a caption in `text-small` set within the standard container width below.

### Negative Space as Content
Intentional empty space is a design element, not wasted screen real estate. Sections should breathe. Minimum `96px` vertical gap between major sections on desktop.

---

## Scroll Storytelling Guidelines

### Lenis + GSAP ScrollTrigger Integration

```js
// Initialize Lenis for smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### Scroll Animation Rules

1. **Reveal, don't perform** — Elements should feel like they were always there, just hidden. Fade + subtle translate (`20px` max).
2. **Stagger siblings** — Cards in a grid stagger `80ms` apart. Never animate all at once.
3. **Pin sparingly** — Pinned scroll sections are powerful but disorienting if overused. Maximum one per page.
4. **Scrub with care** — Scrub-linked animations (progress tied to scroll position) should be limited to background parallax and progress indicators.
5. **Exit gracefully** — If an element animates in, it stays. No animate-out-on-scroll-up unless it's a sticky header.

---

## GPU-Friendly Animation Rules

All animations must run on the compositor thread to maintain 60fps.

### Allowed Animated Properties
- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (sparingly — can drop frames on low-end devices)

### Forbidden Animated Properties
- `width`, `height`, `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `border-width`, `border-radius` (animate `clip-path` instead)
- `box-shadow` (transition between predefined shadows via class swap, not interpolation)

### will-change Budget
- Apply `will-change` only to elements that are about to animate (add on `mouseenter`, remove on `animationend`).
- Maximum **5 elements** with `will-change` active simultaneously.
- Never apply `will-change` globally or in CSS rulesets that match many elements.

### Composite Layer Management
- Use Chrome DevTools → Layers panel to audit composite layer count.
- Target: < 20 composite layers during any animation sequence.
- Three.js/R3F canvas is always its own composite layer — budget accordingly.

> [!WARNING]
> Animations that trigger layout or paint (visible in DevTools Performance tab) must be refactored before shipping. There are no exceptions.

---

## Quality Checklist

Verify every item before shipping any page or component to production.

| #  | Check                                                        | Pass |
| -- | ------------------------------------------------------------ | ---- |
| 1  | All animations use `transform`/`opacity` only                | ☐    |
| 2  | `prefers-reduced-motion` fully respected                     | ☐    |
| 3  | Touch targets ≥ 44×44px on all interactive elements          | ☐    |
| 4  | Focus rings visible on keyboard navigation                   | ☐    |
| 5  | Color contrast meets WCAG AA (4.5:1 text, 3:1 large/UI)     | ☐    |
| 6  | No layout shift on page load (CLS < 0.1)                     | ☐    |
| 7  | Images served in WebP/AVIF with proper `srcset` and `sizes`  | ☐    |
| 8  | Skeleton screens match final component dimensions             | ☐    |
| 9  | Motion hierarchy maintained (page > scroll > component > micro) | ☐ |
| 10 | No more than 5 `will-change` elements active simultaneously  | ☐    |
| 11 | Three.js scenes degrade gracefully on mobile / low-end        | ☐    |
| 12 | Typography scale renders correctly at every breakpoint        | ☐    |
| 13 | Dark mode shadows and surfaces reviewed                       | ☐    |
| 14 | Lenis smooth scroll synced with ScrollTrigger                 | ☐    |
| 15 | Page load performance: LCP < 2.5s, FID < 100ms, CLS < 0.1   | ☐    |

> [!NOTE]
> This checklist is enforced during code review. A component with any unchecked item is blocked from merge until resolved.
