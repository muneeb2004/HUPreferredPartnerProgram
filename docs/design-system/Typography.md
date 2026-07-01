# Typography

> Typography is not styling. It is architecture. The typeface, the weight, the measure, the leading — these are the bones of every layout.

---

## Philosophy

This platform's typography should feel like a **university journal**, not a SaaS dashboard. Headlines carry gravitas. Body text is readable at length. Data is precise and legible. Every typographic choice reinforces the institution's credibility and the editorial quality of the experience.

---

## Font Stack

### Primary — Headlines & Display
**Playfair Display** — A transitional serif with high contrast and elegant proportions. It communicates authority, scholarship, and editorial refinement without feeling archaic.

```ts
// app/layout.tsx
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})
```

**Use for:** Page titles, hero headlines, section headings, pull quotes, editorial accents.

### Secondary — Body & UI
**Inter** — A typeface designed specifically for screens, with excellent legibility at small sizes, open apertures, and carefully tuned metrics. Clean, neutral, professional.

```ts
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})
```

**Use for:** Body text, navigation, buttons, form labels, captions, metadata, UI elements.

### Mono — Code & Data
**JetBrains Mono** — A monospaced typeface with programming ligatures and distinct character shapes. Clear differentiation between similar glyphs (0/O, 1/l/I).

```ts
import { JetBrains_Mono } from 'next/font/google'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
})
```

**Use for:** Code snippets, data tables, technical identifiers, numerical displays.

### Font Loading Strategy
- All fonts loaded via `next/font` for automatic optimization, self-hosting, and zero layout shift.
- `display: 'swap'` ensures text is visible immediately with a fallback, then swaps when the custom font loads.
- Font variables are applied to the `<html>` element and referenced via CSS custom properties.

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html className={`${playfair.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}
```

---

## Type Scale

| Token | Size (px) | Size (rem) | Line Height | Letter Spacing | Weight | Usage |
|-------|----------|-----------|-------------|----------------|--------|-------|
| `xs` | 12 | 0.75 | 1.5 (18px) | +0.02em | 400–500 | Captions, footnotes, metadata |
| `sm` | 14 | 0.875 | 1.5 (21px) | +0.01em | 400–500 | Small body, labels, helper text |
| `base` | 16 | 1 | 1.625 (26px) | 0 | 400 | Default body text |
| `lg` | 18 | 1.125 | 1.6 (29px) | -0.005em | 400 | Large body, lead paragraphs |
| `xl` | 20 | 1.25 | 1.5 (30px) | -0.01em | 400–500 | Sub-headings, card titles |
| `2xl` | 24 | 1.5 | 1.4 (34px) | -0.015em | 500–600 | Section sub-headings |
| `3xl` | 30 | 1.875 | 1.3 (39px) | -0.02em | 600 | Section headings |
| `4xl` | 36 | 2.25 | 1.2 (43px) | -0.025em | 600–700 | Page sub-titles |
| `5xl` | 48 | 3 | 1.15 (55px) | -0.03em | 700 | Page titles |
| `6xl` | 60 | 3.75 | 1.1 (66px) | -0.035em | 700–800 | Hero headlines |
| `7xl` | 72 | 4.5 | 1.05 (76px) | -0.04em | 800–900 | Display / statement type |

> **Pattern:** As size increases, line-height ratio decreases and negative letter-spacing increases. Large type needs tighter metrics to feel cohesive.

---

## Responsive Type Rules

Headlines scale down on smaller viewports. Body text remains stable — legibility is non-negotiable.

| Token | Mobile (< 640px) | Tablet (640–1024px) | Desktop (> 1024px) |
|-------|-----------------|--------------------|--------------------|
| `7xl` | 36px (2.25rem) | 48px (3rem) | 72px (4.5rem) |
| `6xl` | 30px (1.875rem) | 42px (2.625rem) | 60px (3.75rem) |
| `5xl` | 28px (1.75rem) | 36px (2.25rem) | 48px (3rem) |
| `4xl` | 24px (1.5rem) | 30px (1.875rem) | 36px (2.25rem) |
| `3xl` | 22px (1.375rem) | 26px (1.625rem) | 30px (1.875rem) |
| `base` | 16px | 16px | 16px |

```jsx
// Example: Responsive hero headline
<h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl
               font-bold tracking-tight leading-[1.05]">
  Preferred Partners
</h1>
```

---

## Tailwind Configuration

```ts
// tailwind.config.ts (partial)
theme: {
  fontFamily: {
    display: ['var(--font-display)', 'Playfair Display', 'Georgia', 'serif'],
    body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
    mono: ['var(--font-mono)', 'JetBrains Mono', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs:   ['0.75rem',  { lineHeight: '1.5',   letterSpacing: '0.02em'  }],
    sm:   ['0.875rem', { lineHeight: '1.5',   letterSpacing: '0.01em'  }],
    base: ['1rem',     { lineHeight: '1.625', letterSpacing: '0'       }],
    lg:   ['1.125rem', { lineHeight: '1.6',   letterSpacing: '-0.005em'}],
    xl:   ['1.25rem',  { lineHeight: '1.5',   letterSpacing: '-0.01em' }],
    '2xl':['1.5rem',   { lineHeight: '1.4',   letterSpacing: '-0.015em'}],
    '3xl':['1.875rem', { lineHeight: '1.3',   letterSpacing: '-0.02em' }],
    '4xl':['2.25rem',  { lineHeight: '1.2',   letterSpacing: '-0.025em'}],
    '5xl':['3rem',     { lineHeight: '1.15',  letterSpacing: '-0.03em' }],
    '6xl':['3.75rem',  { lineHeight: '1.1',   letterSpacing: '-0.035em'}],
    '7xl':['4.5rem',   { lineHeight: '1.05',  letterSpacing: '-0.04em' }],
  },
}
```

---

## Typographic Guidelines

### Measure (Line Length)
- **Body text:** 65–75 characters per line. This is the range of optimal readability established by centuries of typographic practice.
- **Implementation:** Use `max-w-prose` (65ch) or `max-w-[75ch]`.
- **Never** let body text run the full width of a wide screen. A 1440px-wide paragraph is unreadable.

### Paragraph Spacing
- Between paragraphs: `mb-4` to `mb-6` (16–24px).
- Between a heading and its first paragraph: `mt-2` to `mt-3` (8–12px). Keep them visually connected.
- Between the last paragraph and the next heading: `mt-12` to `mt-16` (48–64px). Clear separation.

### Heading Hierarchy
- **Only one `<h1>` per page.** It is the page title. Period.
- Headings must descend in order: `h1 → h2 → h3`. Never skip levels.
- Use `font-display` (Playfair) for `h1` through `h3`. Use `font-body` (Inter) with `font-semibold` for `h4` through `h6`.

### Typographic Details
- Use **real em-dashes** (—), not double hyphens (--).
- Use **curly quotes** (" ") and apostrophes ('), not straight ones.
- Numbers in running text: spell out one through nine, use numerals for 10+.
- Use **tabular numerals** (`font-variant-numeric: tabular-nums`) in data tables and alignments.
- Apply `text-balance` or `text-pretty` on headings to prevent orphaned words.

### Weight Usage
| Weight | Token | Usage |
|--------|-------|-------|
| 300 | `font-light` | Decorative display text only (large sizes) |
| 400 | `font-normal` | Body text, default |
| 500 | `font-medium` | Labels, navigation, emphasis |
| 600 | `font-semibold` | Sub-headings, card titles |
| 700 | `font-bold` | Section headings, strong emphasis |
| 800 | `font-extrabold` | Hero headlines, display type |
| 900 | `font-black` | Statement typography (use sparingly) |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Use more than 3 font families | Stick to display, body, and mono |
| Set body text below 16px | Maintain `base` (16px) as the body minimum |
| Use `font-bold` on body paragraphs | Use `font-medium` or `font-semibold` for inline emphasis |
| Let headlines wrap to single orphaned words | Apply `text-balance` on headings |
| Skip heading levels (h1 → h3) | Maintain sequential heading hierarchy |
| Use centered text for more than 2–3 lines | Left-align body text; center only short headings |

---

*Typography is the voice of the interface. Choose every word — and every letterform — with intention.*
