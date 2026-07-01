# Grid & Layout System

> Structure that breathes — generous margins, deliberate rhythm, editorial precision.

---

## Philosophy

The layout grid is the invisible architecture of the platform. It enforces visual rhythm and ensures every element sits in a considered relationship with its neighbors. We use a **12-column grid** as the foundation, with generous gutters that expand at larger breakpoints to maintain the editorial, airy quality of the design.

---

## 12-Column Grid

All layouts are built on a 12-column grid. Column count remains constant; gutter and margin sizes adapt by breakpoint.

| Breakpoint | Columns | Gutter   | Margin          |
| ---------- | ------- | -------- | --------------- |
| `< 640px`  | 12      | `16px`   | `16px`          |
| `sm` 640   | 12      | `16px`   | `24px`          |
| `md` 768   | 12      | `24px`   | `32px`          |
| `lg` 1024  | 12      | `32px`   | `48px`          |
| `xl` 1280  | 12      | `32px`   | `auto` (centered) |
| `2xl` 1440 | 12      | `32px`   | `auto` (centered) |

---

## Container Max-Widths

Content containers cap at defined max-widths and center horizontally beyond those thresholds.

| Token          | Max-Width | Typical Usage                       |
| -------------- | --------- | ----------------------------------- |
| `container-sm` | `640px`   | Narrow prose, forms                 |
| `container-md` | `768px`   | Article content, single-column      |
| `container-lg` | `1024px`  | Two-column layouts, dashboards      |
| `container-xl` | `1280px`  | Primary content area                |
| `container-2xl`| `1440px`  | Maximum content width, feature pages|

> [!NOTE]
> The site-wide container defaults to `container-xl` (1280px). Use `container-2xl` only for immersive feature sections or landing pages.

---

## Breakpoint Definitions

Aligned with Tailwind CSS defaults. Mobile-first — styles cascade upward.

| Name  | Min-Width | Target Devices                    |
| ----- | --------- | --------------------------------- |
| base  | `0px`     | Small phones                      |
| `sm`  | `640px`   | Large phones, small tablets       |
| `md`  | `768px`   | Tablets (portrait)                |
| `lg`  | `1024px`  | Tablets (landscape), small laptops|
| `xl`  | `1280px`  | Laptops, desktops                 |
| `2xl` | `1440px`  | Large desktops, ultrawide         |

---

## Layout Patterns

### Full-Bleed
Spans the full viewport width, breaking out of the container. Used for hero sections, featured imagery, and immersive storytelling moments.

### Contained
Content sits within `container-xl` with standard margins. The default for all informational pages.

### Asymmetric
Unequal column splits (e.g., 7/5 or 8/4). Creates visual tension and editorial interest. Used for feature highlights where image and text share the row.

### Editorial
Magazine-inspired layouts mixing full-bleed images with narrow text columns. Pull quotes span wider than body text. Creates rhythm through variation.

---

## Common Layout Compositions

```
2-Column Equal        │  col-span-6  │  col-span-6  │
3-Column Equal        │ span-4 │ span-4 │ span-4 │
Sidebar + Content     │ span-3 │    col-span-9     │
Content + Sidebar     │    col-span-9     │ span-3 │
Feature Grid          │  col-span-8  │ span-4 │
                      │ span-4 │ span-4 │ span-4 │
Hero Split            │  col-span-7  │ col-span-5│
```

### Responsive Behavior

| Composition       | Desktop (`lg+`)   | Tablet (`md`)     | Mobile (`<md`)    |
| ----------------- | ----------------- | ----------------- | ----------------- |
| 2-Column Equal    | 6 / 6             | 6 / 6             | 12 (stacked)      |
| 3-Column Equal    | 4 / 4 / 4         | 6 / 6 + 12        | 12 (stacked)      |
| Sidebar + Content | 3 / 9             | 4 / 8             | 12 (stacked)      |
| Feature Grid      | 8 / 4 + 4/4/4     | 12 + 6/6 + 12     | 12 (stacked)      |

---

## Tailwind Grid Configuration

```js
// tailwind.config.js — extend theme
module.exports = {
  theme: {
    extend: {
      maxWidth: {
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1280px',
        'container-2xl': '1440px',
      },
      gap: {
        'gutter-mobile': '16px',
        'gutter-tablet': '24px',
        'gutter-desktop': '32px',
      },
      padding: {
        'margin-mobile': '16px',
        'margin-tablet': '32px',
        'margin-desktop': '48px',
      },
    },
  },
};
```

### Usage Example

```html
<div class="mx-auto max-w-container-xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
  <div class="grid grid-cols-12 gap-gutter-mobile md:gap-gutter-tablet lg:gap-gutter-desktop">
    <div class="col-span-12 lg:col-span-8"><!-- Main content --></div>
    <div class="col-span-12 lg:col-span-4"><!-- Sidebar --></div>
  </div>
</div>
```

> [!TIP]
> Always use the semantic gap and padding tokens rather than arbitrary values. This ensures consistency and makes global spacing adjustments trivial.
