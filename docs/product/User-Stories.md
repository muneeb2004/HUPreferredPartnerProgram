# User Stories — Habib University Preferred Partner

> **Document Owner:** Product  
> **Last Updated:** 2026-07-01  
> **Status:** Draft  
> **Total Stories:** 40

Stories are prioritised using MoSCoW mapped to visual indicators:

| Symbol | Priority | MoSCoW        |
|--------|----------|---------------|
| 🔴     | P0       | Must Have     |
| 🟠     | P1       | Should Have   |
| 🟡     | P2       | Could Have    |
| ⚪     | P3       | Won't Have (now) |

---

## EP-01 · Landing Experience

| ID     | Story | Priority | Acceptance Criteria |
|--------|-------|----------|---------------------|
| US-001 | As a visitor, I want to see an animated hero section when I land on the homepage so that I immediately understand the platform's purpose. | 🔴 P0 | • Hero loads within 2 s on 4G connections • Includes Habib University branding and a clear value proposition • Animation degrades gracefully when `prefers-reduced-motion` is set • CTA button links to brand catalogue |
| US-002 | As a visitor, I want smooth scroll-driven transitions between homepage sections so that the experience feels editorial and intentional. | 🟠 P1 | • Lenis smooth-scroll initialises without layout shift • Each section triggers entrance animation on scroll • Scroll performance maintains ≥ 55 fps on mid-tier devices |
| US-003 | As a visitor, I want a persistent navigation bar so that I can access any section of the site at all times. | 🔴 P0 | • Nav is visible on all pages and viewports • Nav collapses into a hamburger menu below 768 px • Active route is visually indicated |
| US-004 | As a visitor, I want a footer with university links and legal information so that I can find contact details and policies. | 🟡 P2 | • Footer contains links to Habib University main site, privacy policy, and terms • Footer is responsive across all breakpoints |

---

## EP-02 · Brand Discovery

| ID     | Story | Priority | Acceptance Criteria |
|--------|-------|----------|---------------------|
| US-005 | As a visitor, I want to browse a catalogue of all partner brands so that I can discover available partnerships. | 🔴 P0 | • Catalogue page lists all active brands with logo, name, and category • Page supports grid and list view toggles • Empty state is displayed when no brands match filters |
| US-006 | As a visitor, I want to filter brands by category so that I can find relevant partners quickly. | 🔴 P0 | • Filter UI shows all available categories • Selecting a filter updates results without full page reload • Active filters are visually indicated and clearable |
| US-007 | As a visitor, I want to search for a brand by name so that I can jump directly to a known partner. | 🟠 P1 | • Search input is debounced (300 ms) • Results update in real-time as the user types • No-results state includes a helpful message |
| US-008 | As a visitor, I want to view a dedicated partner page so that I can learn about a brand's relationship with the university. | 🔴 P0 | • Page displays brand logo, description, partnership details, and active offers • Page is server-side rendered for SEO • Back navigation returns user to the catalogue with scroll position preserved |
| US-009 | As a visitor, I want to see featured brands highlighted on the homepage so that I notice key partnerships. | 🟠 P1 | • Featured section shows 3–6 brands curated by admin • Each card links to the brand's partner page • Order is determined by admin-set priority |

---

## EP-03 · Offers & Promotions

| ID     | Story | Priority | Acceptance Criteria |
|--------|-------|----------|---------------------|
| US-010 | As a visitor, I want to view current offers from partner brands so that I can take advantage of discounts. | 🔴 P0 | • Offers page lists all active promotions with title, brand, validity dates, and summary • Expired offers are automatically hidden • Each offer links to its parent partner page |
| US-011 | As a visitor, I want to see offer details including terms and conditions so that I understand how to redeem a promotion. | 🔴 P0 | • Detail view shows full description, redemption steps, T&C, and expiry date • Shareable URL is generated for each offer |
| US-012 | As a visitor, I want to see a badge or label on new offers so that I can spot recently added promotions. | 🟡 P2 | • "New" badge appears on offers created within the last 7 days • Badge styling is consistent with the design system |
| US-013 | As a visitor, I want to sort offers by newest, expiring soon, or brand name so that I can browse efficiently. | 🟠 P1 | • Sort dropdown defaults to "Newest" • Sorting updates the list without page reload • Selected sort option persists during the session |

---

## EP-04 · Newsletter

| ID     | Story | Priority | Acceptance Criteria |
|--------|-------|----------|---------------------|
| US-014 | As a visitor, I want to browse past newsletters so that I can read previous updates from the programme. | 🟠 P1 | • Newsletter archive page lists issues with title, date, and thumbnail • List is paginated (10 per page) |
| US-015 | As a visitor, I want to view a newsletter as an embedded PDF so that I can read it without downloading. | 🟠 P1 | • PDF viewer renders inline on desktop • Mobile falls back to a download link if inline viewing is unsupported • Loading state is shown while the PDF loads |
| US-016 | As a visitor, I want to download a newsletter PDF so that I can save it for offline reading. | 🟡 P2 | • Download button is clearly visible on the newsletter page • Downloaded file name includes issue title and date |
| US-017 | As an admin, I want to upload a newsletter PDF via the dashboard so that I can publish new issues. | 🟠 P1 | • Upload accepts PDF files up to 20 MB • Admin can set title, date, and cover image • Published newsletter appears in the archive immediately |

---

## EP-05 · Authentication

| ID     | Story | Priority | Acceptance Criteria |
|--------|-------|----------|---------------------|
| US-018 | As an admin, I want to log in with secure credentials so that I can access the dashboard. | 🔴 P0 | • Login page validates email format and password length client-side • Failed login shows a descriptive error without exposing internals • Session persists via HTTP-only cookie |
| US-019 | As an admin, I want to log out so that I can end my session securely. | 🔴 P0 | • Logout clears session cookie and redirects to the login page • Accessing protected routes after logout returns 401 |
| US-020 | As a brand partner, I want to log in to the brand portal so that I can manage my brand's information. | 🟠 P1 | • Brand users authenticate with email and password • Access is scoped to their own brand's data only |
| US-021 | As an admin, I want to reset my password via email so that I can recover access if I forget my credentials. | 🟠 P1 | • Reset link is valid for 1 hour • Password must meet minimum complexity requirements • User receives confirmation after successful reset |

---

## EP-06 · Admin Dashboard

| ID     | Story | Priority | Acceptance Criteria |
|--------|-------|----------|---------------------|
| US-022 | As an admin, I want a dashboard overview showing key metrics so that I can monitor the platform at a glance. | 🔴 P0 | • Dashboard displays total brands, active offers, and recent activity • Data refreshes on page load • Layout is responsive |
| US-023 | As an admin, I want to manage partner brands (CRUD) so that I can keep the catalogue up to date. | 🔴 P0 | • Admin can create, read, update, and delete brands • Deletion requires confirmation modal • Changes are reflected on the public site immediately |
| US-024 | As an admin, I want to manage offers (CRUD) so that I can publish and retire promotions. | 🔴 P0 | • Admin can create offers with title, description, dates, T&C, and linked brand • Validation prevents saving offers with end date before start date |
| US-025 | As an admin, I want to manage user accounts so that I can control access to the dashboard and brand portal. | 🟠 P1 | • Admin can invite, deactivate, and assign roles to users • Role changes take effect on next login |
| US-026 | As an admin, I want to reorder featured brands so that I can control homepage presentation. | 🟡 P2 | • Drag-and-drop interface for reordering • Order is saved and reflected on the public homepage |

---

## EP-07 · Brand Portal

| ID     | Story | Priority | Acceptance Criteria |
|--------|-------|----------|---------------------|
| US-027 | As a brand partner, I want to view my brand's public profile so that I can verify how it appears to visitors. | 🟠 P1 | • Portal shows a preview of the live partner page • Preview updates after content edits without publishing |
| US-028 | As a brand partner, I want to edit my brand's description and assets so that I can keep information current. | 🟠 P1 | • Editable fields: description, logo, cover image, contact • Edits enter a pending state until approved by admin |
| US-029 | As a brand partner, I want to submit new offers for admin approval so that promotions go through a review process. | 🟠 P1 | • Offer submission form mirrors admin offer creation • Submitted offers are flagged "Pending Review" in the admin dashboard |
| US-030 | As a brand partner, I want to view analytics for my brand's page so that I can understand engagement. | 🟡 P2 | • Portal displays page views and offer clicks for the partner's brand • Data is scoped — partners cannot see other brands' data |

---

## EP-08 · Content Management System

| ID     | Story | Priority | Acceptance Criteria |
|--------|-------|----------|---------------------|
| US-031 | As an admin, I want to edit static page content (About, FAQ) so that I can update copy without a code deployment. | 🔴 P0 | • CMS provides a rich-text editor for each static page • Changes are published immediately on save • Revision history is maintained |
| US-032 | As an admin, I want to manage media assets (images, PDFs) so that I can reuse them across the site. | 🟠 P1 | • Media library supports upload, rename, and delete • Supported formats: JPEG, PNG, WebP, SVG, PDF • Files are served via CDN |
| US-033 | As an admin, I want to schedule content publication so that updates go live at a specific date and time. | 🟡 P2 | • Scheduler accepts a future date-time • Scheduled items are indicated in the content list • Content auto-publishes at the scheduled time (±5 min tolerance) |
| US-034 | As an admin, I want to preview content changes before publishing so that I can catch errors. | 🟠 P1 | • Preview renders the page exactly as it would appear publicly • Preview link is shareable with stakeholders for review |

---

## EP-09 · Analytics

| ID     | Story | Priority | Acceptance Criteria |
|--------|-------|----------|---------------------|
| US-035 | As an admin, I want to view page-level traffic analytics so that I can understand which content performs best. | 🟠 P1 | • Analytics dashboard shows page views, unique visitors, and bounce rate • Data can be filtered by date range • Charts use accessible colour palettes |
| US-036 | As an admin, I want to track offer engagement (views, clicks) so that I can measure promotion effectiveness. | 🟠 P1 | • Each offer tracks impression and click counts • Data is exportable as CSV |
| US-037 | As an admin, I want to see a summary report of monthly activity so that I can share updates with stakeholders. | 🟡 P2 | • Report includes total visits, top brands, top offers, and new partners added • Report is downloadable as PDF |
| US-038 | As an admin, I want to track catalogue search queries so that I can identify demand for unlisted brands. | ⚪ P3 | • Search queries are logged with timestamp and result count • Admin can view a ranked list of most-searched terms |

---

## EP-10 · Accessibility & Performance

| ID     | Story | Priority | Acceptance Criteria |
|--------|-------|----------|---------------------|
| US-039 | As a visitor using assistive technology, I want all interactive elements to be keyboard-navigable and screen-reader friendly so that I can use the platform independently. | 🔴 P0 | • All interactive elements have visible focus indicators • ARIA labels are present on non-text controls • Site achieves WCAG 2.1 AA compliance on all public pages |
| US-040 | As a visitor on a slow connection, I want pages to load quickly so that I don't abandon the site. | 🔴 P0 | • Largest Contentful Paint ≤ 2.5 s • Cumulative Layout Shift ≤ 0.1 • Images are served in next-gen formats (WebP/AVIF) with responsive `srcset` |
| US-041 | As a visitor on a mobile device, I want the site to be fully responsive so that I have a complete experience on any screen size. | 🔴 P0 | • All pages render correctly at 320 px, 768 px, 1024 px, and 1440 px breakpoints • Touch targets are ≥ 44 × 44 px |
| US-042 | As a visitor, I want animations to respect my motion preferences so that the site doesn't cause discomfort. | 🟠 P1 | • `prefers-reduced-motion: reduce` disables non-essential animations • Core content remains fully accessible with animations disabled |

---

*Generated for internal planning. All priorities are subject to stakeholder review.*
