# Animation & Motion

> Motion is language, not decoration. Every animation must answer: *"What does this help the user understand?"*

---

## Philosophy

Animation in this system serves three purposes and **only** three:

1. **Clarify** — Reveal spatial relationships, show where something came from or went to.
2. **Guide** — Direct attention, establish reading order, create narrative pacing on scroll.
3. **Confirm** — Acknowledge user interaction, validate that an action was received.

If an animation does not serve one of these purposes, it does not belong. The test is simple: **remove the animation. Does the user lose understanding?** If not, the animation is decorative and should be cut.

We do not animate to impress. We animate to communicate.

---

## Duration Scale

| Token | Duration | Easing | Use Case |
|-------|---------|--------|----------|
| `instant` | 0–50ms | — | Checkbox toggles, radio selections |
| `micro` | 50–100ms | `ease-out` | Button active states, focus rings |
| `fast` | 100–200ms | `ease-out` | Hover effects, tooltips, color transitions |
| `normal` | 200–350ms | `ease-in-out` | Accordions, tabs, dropdowns, menu items |
| `moderate` | 350–500ms | custom bezier | Page element entrances, card reveals |
| `slow` | 500–700ms | custom bezier | Modal/drawer open, section reveals |
| `dramatic` | 700–1000ms | custom bezier | Hero entrances, page transitions |

> **Rule:** No single animation should exceed 1000ms. If it needs to be longer, it should be a **sequence** of shorter animations with staggered timing.

---

## Easing Functions

We use custom cubic-bezier curves — not CSS keywords. CSS `ease` and `ease-in-out` are generic and lack character.

| Name | Curve | CSS | Feel |
|------|-------|-----|------|
| `easeOutExpo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Sharp deceleration | Snappy, decisive arrivals |
| `easeInOutCubic` | `cubic-bezier(0.65, 0, 0.35, 1)` | Symmetric ease | Smooth, balanced transitions |
| `easeOutQuart` | `cubic-bezier(0.25, 1, 0.5, 1)` | Fast start, gentle stop | Natural element entrances |
| `easeInQuad` | `cubic-bezier(0.55, 0.085, 0.68, 0.53)` | Gentle acceleration | Exit animations |
| `spring` | Framer Motion spring | `{ stiffness: 300, damping: 30 }` | Organic, physical interactions |

```ts
// lib/motion.ts — Shared easing constants
export const easings = {
  easeOutExpo:    [0.16, 1, 0.3, 1]    as const,
  easeInOutCubic: [0.65, 0, 0.35, 1]   as const,
  easeOutQuart:   [0.25, 1, 0.5, 1]    as const,
  easeInQuad:     [0.55, 0.085, 0.68, 0.53] as const,
}
```

---

## Framer Motion Conventions

### Variant Pattern
All component animations use the **variant pattern** for consistency and composability.

```tsx
// Standard entrance variant
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

<motion.div
  variants={fadeInUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
>
  {/* content */}
</motion.div>
```

### Stagger Children
Parent containers orchestrate child animations through stagger.

```tsx
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

// Children inherit timing from parent
<motion.ul variants={staggerContainer} initial="hidden" whileInView="visible">
  {items.map(item => (
    <motion.li key={item.id} variants={fadeInUp}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

### Layout Animations
Use `layout` prop for smooth DOM reflow animations (filtering, sorting, expanding).

```tsx
<motion.div layout layoutId={`card-${id}`} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
  {/* content that changes size/position */}
</motion.div>
```

### Rules
- `viewport={{ once: true }}` — Elements animate in **once**, they do not replay on re-scroll.
- `margin: "-100px"` — Trigger slightly before the element enters the viewport for smoother feel.
- Keep variant objects in shared files (`lib/motion.ts`), not inline in components.

---

## GSAP Policies

GSAP is used for **complex, choreographed sequences** that exceed Framer Motion's declarative model. Do not use GSAP for simple entrances that Framer Motion handles well.

### When to Use GSAP
- Multi-step timelines with precise synchronization
- ScrollTrigger-driven parallax and pinning
- Text splitting animations (character/word/line reveals)
- Complex SVG path animations
- Coordinated sequences across multiple unrelated DOM elements

### ScrollTrigger Conventions
```ts
useGSAP(() => {
  gsap.to(elementRef.current, {
    y: -100,
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,         // 1-second smoothing
      // pin: true,      // Use sparingly — pinning breaks scroll expectations
    },
  })
}, { scope: containerRef })
```

### Timeline Composition
```ts
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: sectionRef.current,
    start: 'top 80%',
    toggleActions: 'play none none none',
  },
})

tl.from('.headline', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' })
  .from('.subtitle', { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' }, '-=0.3')
  .from('.cta',      { opacity: 0, y: 15, duration: 0.4, ease: 'power3.out' }, '-=0.2')
```

### Rules
- Always use `useGSAP` hook (not `useEffect`) — it handles cleanup automatically.
- Always scope animations to a container ref to prevent global selector conflicts.
- `scrub: true` makes animation directly tied to scroll position. Use `scrub: 1` (with smoothing) for less jittery results.
- Pinning should be used sparingly. Pinned sections disrupt natural scroll flow and can confuse users.
- Kill all ScrollTrigger instances on unmount.

---

## Three.js / React Three Fiber Guidelines

3D is the **most expensive** tool in our system. Use it only when 2D cannot achieve the desired communication.

### When to Use 3D
- ✅ Interactive data visualizations that benefit from spatial exploration
- ✅ Immersive hero experiences for key landing pages (1 per page maximum)
- ✅ Product/object showcases requiring rotation and inspection
- ❌ Background decoration that could be achieved with CSS/SVG
- ❌ Particle systems purely for visual flair
- ❌ 3D text that could be 2D text with good typography

### Performance Budget
| Metric | Budget |
|--------|--------|
| Triangle count | < 50,000 per scene |
| Draw calls | < 50 per frame |
| Texture memory | < 20MB total |
| Target framerate | 60fps on mid-range GPU |
| Canvas resolution | Use device pixel ratio, cap at 2x |
| Load time | Scene interactive within 2s on 4G |

### Implementation Patterns
```tsx
// Lazy-load 3D scenes — never block initial page load
const Scene3D = dynamic(() => import('@/components/scenes/HeroScene'), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-navy-900" />, // placeholder
})

// Inside the R3F Canvas
<Canvas
  dpr={[1, 2]}
  gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
  camera={{ position: [0, 0, 5], fov: 45 }}
>
  <Suspense fallback={null}>
    <SceneContent />
  </Suspense>
</Canvas>
```

### Rules
- Always lazy-load with `next/dynamic` and `ssr: false`.
- Provide a meaningful static placeholder while the scene loads.
- Dispose geometries, materials, and textures on unmount.
- Use `useFrame` with conditional logic — don't run expensive computations every frame.
- Pause rendering when the canvas is not in the viewport (use Intersection Observer).

---

## Lenis Smooth Scroll

Lenis provides normalized, buttery smooth scrolling across browsers.

### Configuration
```ts
// lib/lenis.ts
import Lenis from 'lenis'

const lenis = new Lenis({
  duration: 1.2,           // Scroll duration (seconds)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
})
```

### Integration with GSAP ScrollTrigger
```ts
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)
```

### Rules
- Disable Lenis on pages with complex forms or accessibility-sensitive content.
- Always provide a way to instantly jump to anchors (Lenis `scrollTo` with `immediate: true`).
- Test with trackpads, mice, and touch — feel must be good on all input types.

---

## `prefers-reduced-motion` — MANDATORY

This is not optional. This is not a nice-to-have. Every animation in this system **must** respect the user's motion preferences.

### Implementation
```tsx
// Framer Motion — automatic support
// Set at the top-level layout:
<LazyMotion features={domMax} strict>
  <MotionConfig reducedMotion="user">
    {children}
  </MotionConfig>
</LazyMotion>

// CSS fallback for non-Framer animations
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

// GSAP — check before creating animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReducedMotion) {
  // Set final state immediately, skip animation
  gsap.set(element, { opacity: 1, y: 0 })
} else {
  gsap.from(element, { opacity: 0, y: 30, duration: 0.6 })
}

// Three.js — reduce or eliminate scene animation
// Show a static render or high-quality screenshot instead
```

### What Reduced Motion Means
- **Remove:** Parallax, scroll-jacking, auto-playing sequences, bouncing/pulsing.
- **Keep:** Opacity transitions (instant or near-instant), color changes, layout shifts (use `layout` prop without spring).
- **Replace:** Scroll-triggered reveals become immediately visible. 3D scenes show a static frame.

---

## Motion Hierarchy

Animations are prioritized in layers. Higher layers animate before or more prominently than lower layers.

```
Page Transitions (most prominent)
  └── Section Entrances (scroll-triggered, moderate)
        └── Component Reveals (staggered, subtle)
              └── Micro-interactions (hover, focus, instant)
```

| Layer | Duration Range | Trigger | Example |
|-------|---------------|---------|---------|
| Page | 500–800ms | Route change | Cross-fade, shared layout |
| Section | 400–600ms | Scroll into view | Fade-in-up, text reveal |
| Component | 200–400ms | Scroll / interaction | Card entrance, list stagger |
| Micro | 50–200ms | Hover / focus / click | Button scale, link underline |

> **Rule:** A micro-interaction should never be more visually prominent than a section entrance. Respect the hierarchy.

---

## Performance Budgets

| Metric | Target | Maximum |
|--------|--------|---------|
| Frame rate | 60fps | Never below 30fps |
| Main thread work per frame | < 8ms | < 16ms |
| Layout thrashing | 0 forced reflows | 0 |
| `will-change` elements | < 5 simultaneously | < 10 |
| GPU layers | < 10 promoted | < 20 |
| Total animated elements on screen | < 15 | < 25 |

### `will-change` Policy
- Apply `will-change` only **during** animation, remove after.
- Never apply `will-change` to more than 5 elements simultaneously.
- Prefer `transform` and `opacity` — these are the only truly GPU-composited properties.
- **Never** animate `width`, `height`, `top`, `left`, `margin`, or `padding`. Use `transform: translate/scale` instead.

```tsx
// Good: GPU-composited properties
<motion.div animate={{ opacity: 1, x: 0, scale: 1 }} />

// Bad: Triggers layout recalculation
<motion.div animate={{ width: '100%', marginTop: 0 }} />
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Animate everything on scroll for "wow factor" | Animate key content; let supporting elements simply appear |
| Use `bounce` or `elastic` easing on UI elements | Reserve playful easing for illustrations or mascots only |
| Auto-play complex animations on page load | Trigger on scroll-into-view or user interaction |
| Create animations longer than 1000ms | Compose sequences of shorter, staggered animations |
| Ignore `prefers-reduced-motion` | Implement reduced motion support from day one |
| Use `setInterval` for animation loops | Use `requestAnimationFrame`, GSAP ticker, or `useFrame` |
| Animate layout properties (width, height, top) | Animate `transform` and `opacity` only |

---

*Motion is the last thing we add and the first thing we question. If it doesn't serve the user, it serves no one.*
