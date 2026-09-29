# Design Principles & Visual Design System

## 1. Core UX & Product Design Principles

The design of the **Student-First College Digital Hub** is governed by seven foundational principles:

### Principle 1: Student Agency & Speed Over Administrative Posturing
The legacy college portal treats students as an afterthought behind bureaucratic hierarchies and promotional marketing. This hub exists exclusively to serve the student's operational reality. High-frequency daily needs (timetables, alerts, exam dates, results) take front-and-center precedence over press releases and campus stock photography.

### Principle 2: Unmistakable Information Scent & Plain Language
Never use administrative jargon where plain student language will do. Replace *"Secretariat Notification Bulletin"* with **"Notices"**; replace *"Office of Controller of Examinations Assessment Matrix"* with **"Exam Schedules"**; replace *"Registrarial Attestation Section"* with **"Student Services & Certificates"**. Every link and button must announce exactly what happens next.

### Principle 3: Thumb-Zone Ergonomics & One-Handed Usability
Students browse between lecture halls while carrying bags, books, or holding bus handrails. The primary navigation resides in the bottom 40% of the screen (the natural thumb sweep zone on mobile). Secondary and utility actions live in the top bar. All interactive touch targets must be at least $44 \times 44\text{px}$ with minimum $8\text{px}$ gutter spacing.

### Principle 4: Glanceable Context with Progressive Disclosure
The Home Dashboard answers the student's immediate question within 3 seconds: *"What class do I have right now, and what is coming up next?"* Detail is progressively disclosed: an initial summary card displays the essentials (Course, Time, Room), with an instant expansion or detail sheet available on demand.

### Principle 5: Calibrated Notification Tiering & Alert Integrity
If everything is an emergency, nothing is an emergency. Alerts are strictly partitioned into three tiers:
1. **Tier 1 (Urgent / Emergency):** Severe weather, campus closures, immediate schedule suspensions. High-visibility amber/coral banner.
2. **Tier 2 (Academic Action Required):** Exam registrations, hall ticket releases, fee payment deadlines. Clear action badges.
3. **Tier 3 (Informational / General):** Club workshops, guest talks, campus announcements. Standard chronological feed.

### Principle 6: Universal Accessibility & High Outdoor Legibility
College portals are used under direct sunlight, low battery, and on varying screen qualities. Text contrast must meet or exceed WCAG 2.2 AA standards (body text $\ge 7:1$, UI elements $\ge 3:1$). The hub incorporates full keyboard navigation (`Tab`, `Shift+Tab`, `Enter`, `Escape`), semantic HTML landmarks (`<nav>`, `<main>`, `<header>`, `<section>`), and `aria-live` announcements for dynamic updates.

### Principle 7: Tactile Responsiveness & Fluid Physical Motion
In accordance with modern fluid interface guidelines, interactions respond immediately on pointer-down (scale $0.98$ on press), avoid artificial animation delays, and respect `prefers-reduced-motion` settings.

---

## 2. Visual Design Token System

### 2.1 Color Palette
The color system moves away from generic templates, pairing deep academic navy and slate backgrounds with vibrant, focused cobalt primary actions and semantic alert indicators.

```css
:root {
  /* Brand Primary & Accents */
  --color-primary: #1d4ed8;            /* Deep Royal Blue - High intent */
  --color-primary-hover: #1e40af;
  --color-primary-light: #eff6ff;      /* Crisp subtle highlight */
  --color-accent: #0284c7;             /* Oceanic Cobalt */
  
  /* Semantic Status Colors */
  --color-urgent-bg: #fff1f2;          /* Critical alert background */
  --color-urgent-border: #fecdd3;
  --color-urgent-text: #be123c;        /* High-contrast crimson */
  
  --color-warning-bg: #fffbeb;         /* Impending deadline background */
  --color-warning-border: #fde68a;
  --color-warning-text: #b45309;       /* Deep amber */
  
  --color-success-bg: #f0fdf4;         /* Clearance / passed status */
  --color-success-border: #bbf7d0;
  --color-success-text: #15803d;       /* Emerald forest */
  
  --color-info-bg: #f8fafc;            /* General notices */
  --color-info-border: #e2e8f0;
  --color-info-text: #334155;

  /* Surfaces & Backgrounds */
  --surface-canvas: #f8fafc;           /* Clean soft canvas */
  --surface-card: #ffffff;             /* Crisp elevated card surface */
  --surface-raised: #ffffff;
  --surface-overlay: rgba(15, 23, 42, 0.7); /* Modal backdrop */
  
  /* Text & Typography */
  --text-main: #0f172a;               /* Deep slate / near black for crisp read */
  --text-muted: #475569;              /* Slate-600 for supporting labels */
  --text-subtle: #64748b;             /* Slate-500 for meta/dates */
  --text-inverse: #ffffff;

  /* Borders & Dividers */
  --border-subtle: #e2e8f0;
  --border-medium: #cbd5e1;
  --border-strong: #94a3b8;
  
  /* Elevations & Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(15, 23, 42, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04);
  --shadow-focus: 0 0 0 3px rgba(29, 78, 216, 0.35);
}
```

### 2.2 Typography Scale
Uses a crisp, highly legible modern system typography stack (`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `'Segoe UI'`, `Roboto`, `sans-serif`) ensuring instant zero-network-latency rendering and native rendering sharpness.

| Level | Size (rem / px) | Weight | Line Height | Tracking | Usage |
|---|---|---|---|---|---|
| **Display / Page Title** | 1.75rem (28px) | 700 (Bold) | 1.25 | -0.02em | Main Page / Hub Title |
| **Section Heading (H2)**| 1.25rem (20px) | 600 (Semibold)| 1.35 | -0.01em | Dashboard Widgets, Hub Sub-headers |
| **Card Heading (H3)**   | 1.05rem (17px) | 600 (Semibold)| 1.4  | 0 | Notice Titles, Course Names |
| **Body (Default)**      | 0.9375rem (15px)| 400 (Regular) | 1.5  | 0 | Descriptions, Body Copy |
| **Subtext / Meta**      | 0.8125rem (13px)| 500 (Medium)  | 1.4  | +0.01em | Dates, Category Badges, Room Numbers |
| **Micro / Caption**     | 0.75rem (12px) | 600 (Semibold)| 1.3  | +0.02em | Roll numbers, Tag pills, Counter badges |

### 2.3 Spatial Scale & Grid
- Base unit: $4\text{px} / 8\text{px}$ linear grid.
- `space-1`: $4\text{px}$
- `space-2`: $8\text{px}$
- `space-3`: $12\text{px}$
- `space-4`: $16\text{px}$ (Standard component padding)
- `space-6`: $24\text{px}$ (Section separation)
- `space-8`: $32\text{px}$ (Macro layout spacing)
- Corner radius tokens:
  - `radius-sm`: $6\text{px}$ (Badges, tags)
  - `radius-md`: $10\text{px}$ (Buttons, inputs)
  - `radius-lg`: $14\text{px}$ (Cards, dashboard modules)
  - `radius-full`: $9999\text{px}$ (Pills, circular avatars)

### 2.4 Motion & Micro-Interaction Guidelines
- **Spring feel:** Natural decay using `cubic-bezier(0.16, 1, 0.3, 1)` for modals and drawers.
- **Button presses:** Instant scale down to `0.98` with `100ms ease-out` transition.
- **Reduced Motion:** When `@media (prefers-reduced-motion: reduce)` is active, animations fall back to immediate zero-duration transitions.
