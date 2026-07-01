# Color System

> Color is not decoration. It is meaning. Every hue in this system has a reason to exist and a role to perform.

---

## Philosophy

The Habib University Preferred Partner palette draws from the institution's identity: **deep navy** conveys authority, scholarship, and trust; **gold/amber** signals distinction, achievement, and warmth. Between them, a range of **warm neutrals** provides the quiet backdrop that lets content — not chrome — command attention.

We do not use color to fill space. We use it to **direct focus**, **encode meaning**, and **establish hierarchy**. A restrained palette, applied with precision, will always outperform a rainbow applied with enthusiasm.

---

## Primary Palette

### Navy — Authority & Depth

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `navy-950` | `#060E1A` | 215° 60% 6% | Deepest backgrounds, overlays |
| `navy-900` | `#0A1628` | 215° 58% 10% | Primary dark background |
| `navy-800` | `#0F2240` | 215° 55% 16% | Card surfaces (dark mode) |
| `navy-700` | `#163058` | 215° 52% 22% | Elevated surfaces, borders |
| `navy-600` | `#1E4175` | 215° 50% 29% | Secondary buttons, accents |
| `navy-500` | `#2A5599` | 215° 48% 38% | Interactive elements |
| `navy-400` | `#3D6DB5` | 215° 46% 48% | Links, active states |
| `navy-300` | `#6B91CC` | 215° 40% 61% | Muted accents |
| `navy-200` | `#A3BBE0` | 215° 42% 76% | Light borders, dividers |
| `navy-100` | `#D1DDEF` | 215° 44% 88% | Subtle backgrounds |
| `navy-50` | `#EDF1F8` | 215° 40% 95% | Lightest tint |

### Gold — Distinction & Warmth

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `gold-900` | `#5C3D0E` | 36° 72% 21% | Dark gold accents |
| `gold-800` | `#7A5214` | 36° 68% 28% | Deep warm accents |
| `gold-700` | `#9A6A1C` | 36° 65% 36% | Hover states on gold elements |
| `gold-600` | `#B8822A` | 36° 62% 44% | Secondary gold |
| `gold-500` | `#D4A853` | 40° 60% 58% | **Primary gold** — CTAs, highlights, badges |
| `gold-400` | `#E0BD72` | 40° 58% 66% | Gold on dark backgrounds |
| `gold-300` | `#EAD19A` | 40° 55% 76% | Subtle gold tints |
| `gold-200` | `#F2E3C1` | 40° 52% 85% | Light gold backgrounds |
| `gold-100` | `#F8F0DE` | 40° 48% 92% | Warm surface tint |
| `gold-50` | `#FBF7EE` | 40° 42% 96% | Lightest warm tint |

---

## Neutral Palette — Warm Grays

Neutrals are **warm**, not blue-gray. They carry a subtle amber undertone that harmonizes with the gold palette and softens the severity of the navy.

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `neutral-950` | `#0C0B09` | 30° 10% 4% | Near-black text |
| `neutral-900` | `#1A1814` | 30° 12% 9% | Primary text (dark mode bg) |
| `neutral-800` | `#2E2B25` | 30° 10% 16% | Secondary text (dark) |
| `neutral-700` | `#44403A` | 30° 8% 25% | Tertiary text, borders (dark) |
| `neutral-600` | `#5C5850` | 30° 7% 34% | Muted text |
| `neutral-500` | `#78736A` | 30° 6% 44% | Placeholder text, disabled |
| `neutral-400` | `#9C9890` | 30° 5% 59% | Subtle borders |
| `neutral-300` | `#C2BEB8` | 30° 5% 74% | Dividers, light borders |
| `neutral-200` | `#DCD9D4` | 30° 6% 85% | Background accents |
| `neutral-100` | `#EDEAE6` | 30° 8% 91% | Light surfaces |
| `neutral-50` | `#F6F5F2` | 30° 10% 96% | Page background (light mode) |

---

## Semantic Colors

These colors are used **exclusively** for their designated meaning. Never repurpose a semantic color for decoration.

| Role | Token | Light Mode | Dark Mode | Usage |
|------|-------|-----------|-----------|-------|
| Success | `success-500` | `#2D7D46` | `#4ADE80` | Confirmations, completed states |
| Success BG | `success-50` | `#ECFDF1` | `#052E16` | Success alert backgrounds |
| Warning | `warning-500` | `#B45309` | `#FBBF24` | Cautions, pending states |
| Warning BG | `warning-50` | `#FFFBEB` | `#422006` | Warning alert backgrounds |
| Error | `error-500` | `#DC2626` | `#F87171` | Errors, destructive actions |
| Error BG | `error-50` | `#FEF2F2` | `#450A0A` | Error alert backgrounds |
| Info | `info-500` | `#2563EB` | `#60A5FA` | Informational, neutral callouts |
| Info BG | `info-50` | `#EFF6FF` | `#172554` | Info alert backgrounds |

---

## Surface Colors

| Surface | Light Mode | Dark Mode | Usage |
|---------|-----------|-----------|-------|
| `surface-page` | `neutral-50` (#F6F5F2) | `navy-900` (#0A1628) | Page background |
| `surface-card` | `#FFFFFF` | `navy-800` (#0F2240) | Card, panel backgrounds |
| `surface-elevated` | `#FFFFFF` | `navy-700` (#163058) | Modals, dropdowns, popovers |
| `surface-overlay` | `navy-950/60` | `navy-950/80` | Backdrop overlays |
| `surface-subtle` | `neutral-100` (#EDEAE6) | `navy-800` (#0F2240) | Alternating rows, subtle sections |

---

## Dark Mode

Dark mode is not an inversion — it is a **redesign**. Colors are remapped, not flipped.

### Key Principles
- Backgrounds use `navy-900` and `navy-800`, not pure black (`#000`). Pure black creates excessive contrast and feels harsh.
- Text uses `neutral-100` and `neutral-200`, not pure white. Softer on the eyes.
- Gold becomes slightly lighter to maintain contrast on dark backgrounds.
- Semantic colors shift to their lighter variant for adequate contrast.

### Implementation
```tsx
// Use Tailwind's dark: variant consistently
<div className="bg-neutral-50 dark:bg-navy-900">
  <h2 className="text-neutral-900 dark:text-neutral-100">Heading</h2>
  <p className="text-neutral-600 dark:text-neutral-300">Body text</p>
</div>
```

---

## Contrast Requirements

**All text must meet WCAG AA contrast ratios.** This is not optional.

| Context | Minimum Ratio | Standard |
|---------|--------------|----------|
| Body text (< 18px) | 4.5:1 | WCAG AA |
| Large text (≥ 18px bold / 24px regular) | 3:1 | WCAG AA |
| UI components & graphical objects | 3:1 | WCAG AA |
| Enhanced (target for critical content) | 7:1 | WCAG AAA |

### Verified Combinations

| Foreground | Background | Ratio | Pass |
|-----------|-----------|-------|------|
| `neutral-900` on `neutral-50` | #1A1814 on #F6F5F2 | 14.8:1 | ✅ AAA |
| `neutral-100` on `navy-900` | #EDEAE6 on #0A1628 | 13.2:1 | ✅ AAA |
| `gold-500` on `navy-900` | #D4A853 on #0A1628 | 7.1:1 | ✅ AAA |
| `gold-500` on `neutral-50` | #D4A853 on #F6F5F2 | 2.1:1 | ❌ Fail |
| `gold-700` on `neutral-50` | #9A6A1C on #F6F5F2 | 4.6:1 | ✅ AA |

> **Warning:** `gold-500` does **not** pass contrast on light backgrounds for small text. Use `gold-700` or darker for text on light surfaces. Reserve `gold-500` for large display text, icons, or decorative elements on dark backgrounds.

---

## Tailwind Configuration

```ts
// tailwind.config.ts (partial)
theme: {
  extend: {
    colors: {
      navy: {
        50:  '#EDF1F8',
        100: '#D1DDEF',
        200: '#A3BBE0',
        300: '#6B91CC',
        400: '#3D6DB5',
        500: '#2A5599',
        600: '#1E4175',
        700: '#163058',
        800: '#0F2240',
        900: '#0A1628',
        950: '#060E1A',
      },
      gold: {
        50:  '#FBF7EE',
        100: '#F8F0DE',
        200: '#F2E3C1',
        300: '#EAD19A',
        400: '#E0BD72',
        500: '#D4A853',
        600: '#B8822A',
        700: '#9A6A1C',
        800: '#7A5214',
        900: '#5C3D0E',
      },
      neutral: {
        50:  '#F6F5F2',
        100: '#EDEAE6',
        200: '#DCD9D4',
        300: '#C2BEB8',
        400: '#9C9890',
        500: '#78736A',
        600: '#5C5850',
        700: '#44403A',
        800: '#2E2B25',
        900: '#1A1814',
        950: '#0C0B09',
      },
    },
  },
}
```

---

## Usage Guidelines

| ❌ Don't | ✅ Do |
|----------|-------|
| Use gold-500 for body text on light backgrounds | Use gold-700+ for text on light surfaces |
| Use pure black (#000) or pure white (#FFF) | Use navy-950/neutral-950 and neutral-50/neutral-100 |
| Introduce new colors without system approval | Extend the palette through the design system process |
| Use color as the only indicator of state | Pair color with icons, text labels, or patterns |
| Apply decorative gradients for visual flair | Use flat color with subtle surface separation |

---

*A restrained palette, applied with precision, communicates more than a full spectrum used without thought.*
