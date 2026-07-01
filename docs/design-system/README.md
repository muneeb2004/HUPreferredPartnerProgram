# Habib University Preferred Partner — Design System

> Museum-quality digital craft. Every pixel intentional. Every animation earned.

---

## Philosophy: The Anti AI-Slop Manifesto

We reject the homogeneous, soulless aesthetic that has consumed the modern web. No gratuitous glassmorphism. No generic gradient blobs. No floating 3D shapes that exist only to fill space. No "hero section with big text and a purple-to-blue gradient" templates.

This design system exists to produce work that feels **edited, considered, and human** — the digital equivalent of a beautifully typeset university publication, not a SaaS landing page generator's output.

**What we believe:**

- **Typography is architecture.** The typeface, the weight, the measure, the leading — these are structural decisions, not afterthoughts.
- **Whitespace is not empty.** It is the single most powerful compositional tool we have. It communicates hierarchy, importance, and breathing room.
- **Animation must be earned.** Motion exists to clarify, to guide, to reveal. If removing an animation changes nothing about comprehension, the animation should not exist.
- **Restraint is confidence.** The best designs are the ones where you removed things until only the essential remained.
- **Performance is aesthetic.** A beautiful interface that stutters at 30fps is not beautiful. Speed is a design value.

---

## Principles

### 1. Typography First
Every layout begins with type. Establish the heading hierarchy, the body measure, the vertical rhythm — then build the container around it. Never the reverse.

### 2. Whitespace as Design Element
Generous spacing is not wasted space. Section padding of 120–160px is not excessive — it is the difference between a website and a publication. Let content breathe.

### 3. Intentional Motion
Every animation answers the question: *"What does this help the user understand?"* Entrance animations reveal hierarchy. Scroll-triggered reveals create narrative pacing. Hover states confirm interactivity. Everything else is noise.

### 4. Editorial Quality
Treat every page as a spread in a university journal. Asymmetric layouts, considered image placement, pull quotes, typographic flourishes where appropriate. The bar is print design, not web templates.

### 5. Performance-Conscious Beauty
Target 60fps on mid-range devices. Use GPU-accelerated properties (`transform`, `opacity`). Lazy-load 3D scenes. Respect `prefers-reduced-motion`. Beauty that excludes users or devices is not beauty.

---

## Tech Foundation

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | **Next.js 14+** (App Router) | SSR, routing, RSC |
| Styling | **Tailwind CSS 3.4+** | Utility-first CSS with custom design tokens |
| Components | **shadcn/ui** | Accessible, unstyled primitives we own and customize |
| Animation | **Framer Motion** | Declarative React animations, layout transitions |
| Animation (Advanced) | **GSAP + ScrollTrigger** | Complex timelines, scroll-driven sequences |
| 3D | **Three.js + React Three Fiber** | Immersive 3D scenes (used sparingly) |
| Scroll | **Lenis** | Smooth, normalized scrolling behavior |

---

## How to Use This System

### Reading Order
1. **[Color](./Color.md)** — Understand the palette before anything else
2. **[Typography](./Typography.md)** — The backbone of every layout
3. **[Spacing](./Spacing.md)** — The grid and rhythm system
4. **[Animation](./Animation.md)** — Motion language and constraints

### In Practice
- **Always** use design tokens from Tailwind config — never hardcode values.
- **Always** check color contrast against WCAG AA (4.5:1 for body text).
- **Always** provide `prefers-reduced-motion` alternatives.
- **Never** add animation without articulating its purpose.
- **Never** introduce a new color, font size, or spacing value outside the scale.

### Component Development
1. Start with the shadcn/ui primitive (if one exists).
2. Style using Tailwind utilities mapped to our design tokens.
3. Add motion with Framer Motion variants (see Animation docs).
4. Test at 320px, 768px, 1024px, 1440px, and 1920px breakpoints.
5. Verify with a screen reader and keyboard navigation.

---

## Contribution Guidelines

### Adding to the System
1. **Open a discussion first.** No new tokens, components, or patterns without team review.
2. **Document the "why."** Every addition must include rationale — not just what it is, but why it's necessary and what existing options were insufficient.
3. **Show restraint.** If the system already solves the problem at 90%, extend — don't reinvent.

### Naming Conventions
- Tailwind tokens: `kebab-case` (e.g., `navy-900`, `gold-500`)
- Component files: `PascalCase.tsx`
- Animation variants: `camelCase` (e.g., `fadeInUp`, `staggerChildren`)
- Documentation files: `PascalCase.md`

### Code Review Checklist
- [ ] Uses only design system tokens (no magic numbers)
- [ ] Meets WCAG AA contrast requirements
- [ ] Includes `prefers-reduced-motion` handling
- [ ] Tested across breakpoint range
- [ ] No layout shift on load (CLS < 0.1)
- [ ] Animations run at 60fps on target devices

### Pull Request Template
```
## What
[Brief description]

## Why
[Design rationale — why this approach over alternatives]

## Design System Impact
- [ ] New token added
- [ ] Existing token modified
- [ ] New component pattern
- [ ] Animation added

## Screenshots / Recordings
[Required for any visual change]
```

---

*This system is a living document. It evolves through deliberate, considered additions — never through accumulation.*
