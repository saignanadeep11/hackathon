# AssetFlow Design System

Version: 1.0
Design Style: Modern SaaS
Framework: Quasar
Theme: Light + Dark
Icons: Lucide
Typography: Inter

---

# Design Philosophy

AssetFlow is an enterprise application focused on clarity, speed, and usability.

The interface should prioritize:

- Clear information hierarchy
- Minimal visual noise
- Fast navigation
- High data density without clutter
- Consistent spacing
- Accessibility
- Responsive layouts

The UI should feel closer to Linear, Stripe Dashboard, Notion, and Atlassian than a traditional ERP.

---

# Design Principles

## 1. Function over Decoration

Every element must have a purpose.

Avoid unnecessary gradients, animations, or decorative effects.

---

## 2. Consistency

The same interaction should always look and behave the same.

Buttons, dialogs, tables, badges, forms, and navigation should follow reusable patterns.

---

## 3. Information First

Users spend most of their time:

- Reading tables
- Searching assets
- Managing workflows

The design should emphasize readability over visual effects.

---

# Theme

Supports:

- ☀️ Light Theme
- 🌙 Dark Theme

Theme toggle available in header.

System preference supported.

---

# Color Palette

## Primary

Blue 600

Used for:

- Primary buttons
- Active navigation
- Links
- Selected states
- Charts

## Secondary

Slate

Used for:

- Secondary buttons
- Tags
- Borders
- Neutral actions

## Semantic Colors

Success

Green

Examples

- Available
- Approved
- Verified
- Completed

Warning

Amber

Examples

- Pending
- Reserved
- Upcoming Return

Danger

Red

Examples

- Lost
- Rejected
- Overdue
- Failed

Info

Blue

Examples

- Notifications
- New
- Active

---

# Asset Status Colors

Available
→ Green

Allocated
→ Blue

Reserved
→ Orange

Under Maintenance
→ Purple

Lost
→ Red

Retired
→ Gray

Disposed
→ Slate

---

# Typography

Font

Inter

Font Sizes

Display

36

Heading 1

30

Heading 2

24

Heading 3

20

Title

18

Body

14

Small

13

Caption

12

Font Weight

Regular

400

Medium

500

SemiBold

600

Bold

700

---

# Border Radius

Cards

8px

Buttons

8px

Inputs

8px

Dialogs

12px

Badges

999px

---

# Shadows

Cards

Soft elevation

Dialogs

Medium elevation

Dropdowns

Medium elevation

Avoid heavy shadows.

---

# Layout

Header Height

64px

Sidebar Width

260px

Collapsed Sidebar

72px

Content Padding

24px

Maximum Content Width

Fluid

---

# Grid

Desktop

12 Columns

Tablet

8 Columns

Mobile

4 Columns

Spacing

8px grid system

Common spacing

4
8
12
16
24
32
48
64

---

# Buttons

Primary

Filled

Used for primary actions.

Secondary

Outlined

Danger

Filled Red

Ghost

Text only

Icon Button

Square

40x40

---

# Forms

Input Height

44px

Label Above Input

Required fields

Marked using *

Validation

Shown immediately below the input.

---

# Tables

Default View

- Sticky Header
- Search
- Filters
- Sorting
- Pagination

Row Height

48px

Hover

Subtle background highlight

Selected

Primary tint

---

# Status Chips

Rounded pill

Small

Color coded

Examples

Available

Allocated

Pending

Approved

Rejected

---

# Dashboard

Cards

Rounded

Small shadow

Consistent height

Dashboard Widgets

- KPI Cards
- Recent Activity
- Asset Allocation
- Booking Calendar
- Notifications
- Upcoming Maintenance
- Charts

---

# Charts

Library

Vue Chart.js

Chart Types

- Line
- Bar
- Doughnut
- Pie
- Area

Charts should use the application theme colors.

No rainbow palettes.

---

# Icons

Library

Lucide

Default Size

18px

Navigation

20px

Hero

24px

Do not mix icon libraries.

---

# Dialogs

Maximum Width

640px

Large Dialog

960px

Actions aligned to the right.

---

# Animations

Duration

200ms

Use only for:

- Drawer
- Dialog
- Hover
- Collapse
- Theme switch

Avoid unnecessary animations.

---

# Accessibility

Minimum touch target

40px

Keyboard navigation

Supported

Visible focus ring

Required

Color contrast

WCAG AA

---

# Responsive Behavior

Desktop

Sidebar expanded

Tablet

Sidebar collapsible

Mobile

Drawer navigation

Cards stack vertically.

Tables become responsive.

---

# Empty States

Every module should include:

- Illustration or icon
- Helpful message
- Primary action

Example

"No assets found."

Button

Register Asset

---

# Loading States

Use skeleton loaders.

Avoid empty white screens.

---

# Notifications

Success

Top Right

4 seconds

Warning

Sticky

Errors

Manual dismiss

---

# Component Naming

AssetCard

EmployeeCard

KpiCard

BookingCalendar

MaintenanceTimeline

StatusBadge

InfoPanel

ActionMenu

SearchToolbar

FilterDrawer

---

# Design Goal

Simple.

Professional.

Fast.

Enterprise-ready.

Every screen should feel consistent and require almost no learning curve.