# Elevation & Depth System

> Subtle, architectural depth — never decorative, never flashy.

---

## Philosophy

Elevation in the Preferred Partner platform follows the principle of **quiet depth**. Shadows are used to communicate spatial hierarchy, not to decorate. Every shadow must earn its place — if an element doesn't need to communicate layering, it doesn't get a shadow.

We draw from architectural and editorial design: depth is implied through spacing, border contrast, and minimal shadow rather than heavy drop-shadows or glassmorphism. The goal is a museum-quality surface where light feels natural and intentional.

**Guiding rules:**

- Shadows suggest physical layering, not visual noise
- Lower elevations use warm, diffused shadows; higher elevations use tighter, darker ones
- Dark mode shadows shift to darker opacity, never glow
- Prefer border/contrast separation over shadow when possible

---

## Shadow Scale

Five defined elevation levels. Use sparingly — most content lives at `none` or `sm`.

| Level  | Token              | CSS Value                                          | Usage                              |
| ------ | ------------------ | -------------------------------------------------- | ---------------------------------- |
| `none` | `shadow-none`      | `none`                                             | Default. Flat content, text blocks |
| `sm`   | `shadow-elevation-sm`  | `0 1px 2px 0 rgba(0, 0, 0, 0.04)`                 | Cards at rest, subtle separation   |
| `md`   | `shadow-elevation-md`  | `0 2px 8px -2px rgba(0, 0, 0, 0.08)`              | Hovered cards, dropdowns           |
| `lg`   | `shadow-elevation-lg`  | `0 8px 24px -4px rgba(0, 0, 0, 0.10)`             | Modals, dialogs, popovers         |
| `xl`   | `shadow-elevation-xl`  | `0 16px 48px -8px rgba(0, 0, 0, 0.14)`            | Toast notifications, command palette |

### Dark Mode Adjustments

In dark mode, shadows are intensified and shifted cooler. Background surfaces are already dark, so shadow contrast must increase to remain perceptible.

| Level  | Dark Mode CSS Value                                |
| ------ | -------------------------------------------------- |
| `sm`   | `0 1px 2px 0 rgba(0, 0, 0, 0.20)`                 |
| `md`   | `0 2px 8px -2px rgba(0, 0, 0, 0.30)`              |
| `lg`   | `0 8px 24px -4px rgba(0, 0, 0, 0.40)`             |
| `xl`   | `0 16px 48px -8px rgba(0, 0, 0, 0.50)`            |

> [!IMPORTANT]
> Never use `box-shadow` with light or colored values in dark mode. No glows. Depth is communicated through darkness, not luminance.

---

## Z-Index Scale

Organized by semantic layer to prevent z-index wars. All values are defined as design tokens.

| Layer       | Token              | Value  | Usage                                 |
| ----------- | ------------------ | ------ | ------------------------------------- |
| `base`      | `z-base`           | `0`    | Default document flow                 |
| `raised`    | `z-raised`         | `10`   | Cards, interactive elements           |
| `dropdown`  | `z-dropdown`       | `100`  | Dropdown menus, select panels         |
| `sticky`    | `z-sticky`         | `200`  | Sticky headers, floating nav          |
| `overlay`   | `z-overlay`        | `300`  | Backdrop overlays, scrims             |
| `modal`     | `z-modal`          | `400`  | Dialogs, modals, drawers              |
| `toast`     | `z-toast`          | `500`  | Toast notifications, snackbars        |

> [!TIP]
> Never use arbitrary z-index values. If a new layer is needed, define it in the scale with a clear semantic name.

---

## Depth Usage Guidelines

1. **Cards at rest** — `shadow-elevation-sm` or `none` with a 1px border. Shadow appears on hover (`shadow-elevation-md`).
2. **Dropdowns & popovers** — `shadow-elevation-md`. Must visually sit above the triggering element.
3. **Modals & dialogs** — `shadow-elevation-lg` with a scrim overlay at `z-overlay`.
4. **Toasts** — `shadow-elevation-xl` at `z-toast`. Highest visual priority.
5. **Nested elevation** — Avoid stacking shadows. A card inside a modal should use `shadow-none`.

---

## Tailwind Configuration

```js
// tailwind.config.js — extend theme
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'elevation-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'elevation-md': '0 2px 8px -2px rgba(0, 0, 0, 0.08)',
        'elevation-lg': '0 8px 24px -4px rgba(0, 0, 0, 0.10)',
        'elevation-xl': '0 16px 48px -8px rgba(0, 0, 0, 0.14)',
      },
      zIndex: {
        base: '0',
        raised: '10',
        dropdown: '100',
        sticky: '200',
        overlay: '300',
        modal: '400',
        toast: '500',
      },
    },
  },
};
```

> [!NOTE]
> Dark mode shadow overrides should be applied via the `dark:` variant in component styles, not as separate tokens. This keeps the single-source shadow scale intact while allowing contextual adjustment.
