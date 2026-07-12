# AssetFlow Design System — Glassmorphic Precision

**Version:** 1.1 (Final)
**Design Style:** Modern SaaS / Glassmorphic
**Framework:** Vue 3 + Quasar Framework v2
**Icons:** Lucide (Quasar-compatible)
**Typography:** Plus Jakarta Sans

---

# Design Philosophy

AssetFlow is a high-fidelity enterprise application that balances advanced visual depth with strict functional clarity. 

- **Depth & Layering:** Use transparency and blur to create a sense of hierarchy.
- **Glassmorphism:** Frosted glass surfaces for a premium, high-tech command center feel.
- **Data Density:** High-density layouts optimized for enterprise-grade asset monitoring.
- **Micro-Interactions:** Subtle scale and opacity transitions to provide tactile feedback.

---

# Color Palette (Dark Mode Primary)

## Core Brand
- **Primary (Action Blue):** `#3b82f6` (Quasar `$primary`)
- **Secondary (Slate):** `#64748b` (Quasar `$secondary`)
- **Accent (Indigo Glass):** `#818cf8` (Quasar `$accent`)

## Surface Hierarchy
- **Surface (Background):** `#0b1326` (Quasar `$dark`)
- **Surface Container (Lowest):** `#060e20` (Quasar `$dark-page`)
- **Surface Bright:** `#31394d`
- **Glass Surface:** `rgba(19, 27, 46, 0.6)` with `backdrop-blur: 12px`

## Semantic Status
- **Success (Available/Verified):** `#10b981` (Emerald)
- **Info (Allocated/Active):** `#3b82f6` (Blue)
- **Warning (Pending/Reserved):** `#f59e0b` (Amber)
- **Danger (Overdue/Lost):** `#ef4444` (Red)
- **Maintenance:** `#a855f7` (Purple)

---

# Typography

**Font:** Plus Jakarta Sans (fallback to Inter)

| Role | Size (px) | Weight | Line Height |
| :--- | :--- | :--- | :--- |
| Display | 36 | 700 (Bold) | 1.2 |
| Heading 1 | 30 | 600 (SemiBold) | 1.3 |
| Heading 2 | 24 | 600 (SemiBold) | 1.3 |
| Title | 18 | 500 (Medium) | 1.4 |
| Body | 14 | 400 (Regular) | 1.5 |
| Small / Label | 13 | 500 (Medium) | 1.4 |
| Caption | 12 | 400 (Regular) | 1.4 |

---

# Component Architecture (Quasar Customization)

## 1. Glass Cards (`.q-card--glass`)
- **Background:** `rgba(255, 255, 255, 0.03)`
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Backdrop Blur:** `12px`
- **Border Radius:** `12px`
- **Shadow:** Atmospheric soft glow `0 8px 32px 0 rgba(0, 0, 0, 0.3)`

## 2. Buttons
- **Shape:** `8px` corner radius.
- **Primary:** Gradient from `$primary` to `$accent` for depth.
- **Ghost/Flat:** Use on glass surfaces with white text at 70% opacity.

## 3. Tables (`.q-table--glass`)
- **Row Hover:** `rgba(255, 255, 255, 0.05)`
- **Header:** Sticky, translucent background.
- **Density:** `compact` or `middle` for enterprise view.

## 4. Status Badges
- **Shape:** Full pill (`rounded-full`).
- **Style:** Subtle transparent background (10% opacity of semantic color) with high-vibrancy text and a leading 6px glow dot.

---

# Animations (Tier 1)

- **Standard Duration:** 200ms
- **Timing Function:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Page Transitions:** Subtle vertical slide (20px) and fade.
- **Hover States:** Scale `1.02` for interactive cards.

---

# Implementation Notes (Vue + Quasar)

- Use Quasar's `dark.set(true)` as the default.
- Utilize `q-glass` custom utility classes for `backdrop-filter: blur(12px)`.
- Ensure all Lucide icons are sized at `20px` for consistency.
- Implement Skeleton Loaders (`q-skeleton`) matching the card geometry (12px radius).
