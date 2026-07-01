# Spacing System

> Whitespace is not empty — it is a design element. The most powerful one we have.

---

## Philosophy

Space communicates hierarchy, importance, and rhythm. A cramped layout screams "we had too much to say and too little confidence to edit." Generous whitespace says "what remains is worth your attention."

Every spacing value in this system is derived from a **4px base unit** on an **8px grid**. No arbitrary values. No "just add a few more pixels until it looks right." The grid is the law.

---

## Spacing Scale

| Token | Value (px) | Value (rem) | Tailwind Class | Usage |
|-------|-----------|-------------|----------------|-------|
| `0` | 0 | 0 | `p-0` / `m-0` | Reset |
| `0.5` | 2 | 0.125 | `p-0.5` / `m-0.5` | Hairline gaps |
| `1` | 4 | 0.25 | `p-1` / `m-1` | Tight inline spacing |
| `1.5` | 6 | 0.375 | `p-1.5` / `m-1.5` | Icon-to-label gaps |
| `2` | 8 | 0.5 | `p-2` / `m-2` | Compact component padding |
| `3` | 12 | 0.75 | `p-3` / `m-3` | Small component padding |
| `4` | 16 | 1 | `p-4` / `m-4` | Default component padding |
| `5` | 20 | 1.25 | `p-5` / `m-5` | Medium component padding |
| `6` | 24 | 1.5 | `p-6` / `m-6` | Card padding, form groups |
| `8` | 32 | 2 | `p-8` / `m-8` | Large component padding |
| `10` | 40 | 2.5 | `p-10` / `m-10` | Container padding (mobile) |
| `12` | 48 | 3 | `p-12` / `m-12` | Section sub-spacing |
| `16` | 64 | 4 | `p-16` / `m-16` | Section internal padding |
| `20` | 80 | 5 | `p-20` / `m-20` | Section spacing (minimum) |
| `24` | 96 | 6 | `p-24` / `m-24` | Section spacing (standard) |

> **Rule:** If you need a spacing value not on this scale, you are likely solving the wrong problem. Step back and reconsider the layout.

---

## Section Spacing

These are the vertical rhythm rules that give the platform its editorial feel. Do not compress them.

### Hero Sections
- **Top padding:** 120–160px (`pt-[120px]` to `pt-[160px]` or `pt-28` to `pt-40`)
- **Bottom padding:** 80–120px
- **Rationale:** The hero breathes. It is the first thing a user sees — give it the reverence of a title page.

### Content Sections
- **Between sections:** 80–120px (`py-20` to `py-[120px]`)
- **Section internal padding:** 48–64px (`py-12` to `py-16`)
- **Rationale:** Clear, rhythmic separation. Each section is a discrete chapter.

### Component Groups
- **Between related components:** 24–48px (`gap-6` to `gap-12`)
- **Between unrelated components:** 48–64px (`gap-12` to `gap-16`)

### Inline Elements
- **Icon to label:** 6–8px (`gap-1.5` to `gap-2`)
- **Button padding:** 12–16px vertical, 24–32px horizontal
- **Form field spacing:** 16–24px (`space-y-4` to `space-y-6`)

---

## Component Internal Spacing

### Cards
```
┌──────────────────────────────┐
│          24px (p-6)          │
│  ┌──────────────────────┐   │
│  │  Content Area        │   │
│  └──────────────────────┘   │
│          16px gap            │
│  ┌──────────────────────┐   │
│  │  Action Area         │   │
│  └──────────────────────┘   │
│          24px (p-6)          │
└──────────────────────────────┘
```
- Padding: `p-6` (24px) standard, `p-8` (32px) for featured cards
- Internal gap: `gap-4` (16px) between content blocks

### Navigation
- Nav item padding: `px-4 py-2` (16px × 8px)
- Nav item gap: `gap-1` (4px) to `gap-2` (8px)
- Nav container padding: `px-6` (24px) to `px-10` (40px)

### Modals & Dialogs
- Outer padding: `p-8` (32px) minimum
- Content gap: `gap-6` (24px)
- Action bar top margin: `mt-8` (32px)

---

## Container Widths

| Context | Max Width | Tailwind |
|---------|----------|----------|
| Prose / Reading | 720px | `max-w-prose` or `max-w-[720px]` |
| Content | 960px | `max-w-[960px]` |
| Standard | 1200px | `max-w-[1200px]` |
| Wide | 1440px | `max-w-[1440px]` |
| Full bleed | 100% | `max-w-full` |

- **Horizontal page padding:** `px-6` (24px) on mobile, `px-10` (40px) on tablet, `px-16` (64px) on desktop.

---

## Responsive Spacing Adjustments

Spacing compresses on smaller viewports, but never to the point of feeling cramped. The ratios should feel proportional.

| Context | Desktop | Tablet (md) | Mobile (sm) |
|---------|---------|-------------|-------------|
| Hero top padding | 160px | 120px | 80px |
| Section spacing | 120px | 80px | 64px |
| Component gaps | 48px | 32px | 24px |
| Card padding | 32px | 24px | 20px |
| Page horizontal padding | 64px | 40px | 24px |

```jsx
// Example: Responsive section spacing
<section className="py-16 sm:py-20 md:py-24 lg:py-[120px]">
  {/* content */}
</section>

// Example: Responsive container
<div className="px-6 sm:px-8 md:px-10 lg:px-16 max-w-[1200px] mx-auto">
  {/* content */}
</div>
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Use `margin-top: 37px` | Use a spacing token: `mt-10` (40px) |
| Collapse section spacing on mobile to near-zero | Maintain proportional spacing: 120px → 64px, not 120px → 16px |
| Mix padding and margin for the same spacing concern | Be consistent — use `gap` for flex/grid children |
| Add spacing "until it looks right" | Reference the scale, choose the closest token |
| Use `space-y-*` on complex layouts | Use `gap-*` with flex or grid instead |

---

*The grid is not a constraint — it is a foundation. Build on it, never around it.*
