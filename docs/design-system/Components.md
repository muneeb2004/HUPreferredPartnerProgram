# Component Architecture

> Systematic composition — every component is a building block with clear purpose and boundaries.

---

## Atomic Design Hierarchy

The component library follows atomic design principles, adapted for a Next.js + shadcn/ui architecture.

### Atoms
The smallest, indivisible UI elements. Typically map 1:1 to shadcn/ui primitives.

- Button, Badge, Avatar, Icon, Input, Label, Separator, Skeleton, Tooltip

### Molecules
Combinations of atoms that form a single functional unit.

- SearchInput (Input + Icon + Button)
- FormField (Label + Input + Error message)
- StatItem (Icon + Value + Label)
- NavLink (Link + Icon + Active indicator)

### Organisms
Complex, self-contained UI sections composed of molecules and atoms.

- PartnerCard, OfferCard, NewsletterCard
- HeroSection, FilterBar, BrandGrid
- StatsCounter, TestimonialBlock, Footer

### Templates
Page-level layout structures that define content regions without specific data.

- DefaultLayout (Header + Main + Footer)
- DashboardLayout (Sidebar + Header + Content)
- LandingTemplate (Hero + Features + CTA + Footer)

### Pages
Templates hydrated with real data. Correspond to Next.js route pages.

- `/` → Home page
- `/partners` → Partner listing
- `/partners/[slug]` → Partner detail
- `/offers` → Offers listing
- `/about` → About page

---

## shadcn/ui Base Components

The following shadcn/ui components form the primitive layer. They are installed individually and customized via the project's design tokens.

| Component    | Usage Context                          | Customization Notes                    |
| ------------ | -------------------------------------- | -------------------------------------- |
| `Button`     | Primary actions, CTAs, form submits    | Custom variants: `primary`, `ghost`, `outline`, `destructive` |
| `Card`       | Partner cards, offer cards, content blocks | Extended with hover elevation, border treatment |
| `Dialog`     | Confirmations, detail views, forms     | Custom overlay opacity, enter/exit animation |
| `Input`      | Forms, search fields                   | Custom focus ring color, height (44px min) |
| `Select`     | Dropdowns, filter controls             | Styled to match input height and focus states |
| `Badge`      | Status indicators, category labels     | Variants: `default`, `secondary`, `success`, `warning` |
| `Tabs`       | Content organization, section switching| Underline style, animated indicator    |
| `Tooltip`    | Contextual help, icon explanations     | Delay: 300ms, dark background          |
| `Skeleton`   | Loading placeholders                   | Matches component dimensions exactly   |
| `Separator`  | Visual dividers                        | Subtle, uses `border-muted`            |
| `Sheet`      | Mobile navigation, filter panels       | Slide from left (nav) or bottom (filters) |
| `Popover`    | Rich tooltips, mini-forms              | Max-width: 320px                       |

---

## Custom Component Patterns

### PartnerCard
Displays a partner brand with logo, name, category, and offer count. Hover reveals a subtle elevation shift and CTA.

```
Props: partner: Partner, variant?: 'default' | 'featured', className?: string
```

### OfferCard
Shows an individual offer with discount percentage, partner brand, expiry, and redemption CTA.

```
Props: offer: Offer, variant?: 'compact' | 'expanded', className?: string
```

### NewsletterCard
Email signup card with heading, description, input field, and submit button. Appears in grid layouts or as standalone CTA.

```
Props: heading?: string, description?: string, className?: string
```

### HeroSection
Full-width hero with headline, subheadline, CTA buttons, and optional background media (image or Three.js scene).

```
Props: title: string, subtitle?: string, cta: CTA, media?: 'image' | '3d-scene', className?: string
```

### BrandGrid
Logo grid displaying partner brands. Supports filtering by category. Logos are grayscale at rest, full color on hover.

```
Props: partners: Partner[], columns?: 3 | 4 | 5 | 6, className?: string
```

### FilterBar
Horizontal bar with category filters, sort controls, and search. Collapses to bottom sheet on mobile.

```
Props: categories: Category[], onFilter: (filters: FilterState) => void, className?: string
```

### StatsCounter
Animated counter row displaying key metrics (partners, offers, savings). Numbers animate on scroll-into-view via GSAP.

```
Props: stats: Stat[], className?: string
```

---

## Composition Rules

1. **Single responsibility** — Each component does one thing well. If a component handles both data fetching and rendering, split it into a container and a presentational component.
2. **Props down, events up** — Data flows downward through props. User actions bubble upward through callbacks.
3. **No deep prop drilling** — Use React Context or Zustand for state that spans more than two levels.
4. **Composition over configuration** — Prefer composable children (slots) over complex prop objects. A `Card` should accept `CardHeader`, `CardContent`, `CardFooter` as children, not a monolithic config prop.
5. **Colocation** — Component styles, tests, and types live alongside the component file.

---

## Component Naming Conventions

| Type               | Convention             | Example                    |
| ------------------ | ---------------------- | -------------------------- |
| Component file     | `PascalCase.tsx`       | `PartnerCard.tsx`          |
| Component folder   | `kebab-case/`          | `partner-card/`            |
| Variant file       | `component.variants.ts`| `button.variants.ts`       |
| Type file          | `component.types.ts`   | `partner-card.types.ts`    |
| Test file          | `component.test.tsx`   | `partner-card.test.tsx`    |
| Story file         | `component.stories.tsx`| `partner-card.stories.tsx` |

---

## Props Patterns with CVA

All component variants are defined using `class-variance-authority` (CVA) for type-safe, composable styling.

```tsx
// button.variants.ts
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        outline: 'border border-input bg-background hover:bg-accent',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-base',
        lg: 'h-13 px-8 text-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
```

---

## Component File Structure

```
src/
  components/
    ui/                     # shadcn/ui primitives (auto-generated)
      button.tsx
      card.tsx
      dialog.tsx
      ...
    custom/                 # Project-specific components
      partner-card/
        PartnerCard.tsx
        partner-card.variants.ts
        partner-card.types.ts
        partner-card.test.tsx
      offer-card/
        OfferCard.tsx
        ...
    layout/                 # Layout components
      Header.tsx
      Footer.tsx
      Sidebar.tsx
      DefaultLayout.tsx
```

---

## Accessibility Requirements

Every component must meet WCAG 2.1 AA. These are non-negotiable baseline requirements.

| Requirement                | Applies To              | Standard                              |
| -------------------------- | ----------------------- | ------------------------------------- |
| Keyboard navigation        | All interactive elements| Tab, Enter, Escape, Arrow keys        |
| Focus visible indicator    | All focusable elements  | 2px ring, `ring-offset-2`            |
| Color contrast             | All text                | 4.5:1 (normal), 3:1 (large)          |
| Screen reader labels       | Icons, images, controls | `aria-label`, `alt`, `role`           |
| Reduced motion             | All animations          | Respect `prefers-reduced-motion`      |
| Touch target size          | All interactive elements| Minimum 44 × 44px                    |
| Error identification       | Form inputs             | Inline error messages + `aria-invalid`|
| Live regions               | Dynamic content updates | `aria-live="polite"` for status       |

> [!CAUTION]
> Components that fail accessibility requirements must not be merged. Accessibility is tested in CI alongside visual regression tests.
