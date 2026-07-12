# Hackathon Project Rules (AssetFlow)

These rules are strictly enforced for all agent operations on this project.

## 1. Requirements & Business Logic
Always base features, workflows, and data structures on the official AssetFlow problem statement before writing code:
- **Problem Statement**: [problem-statement.md](file:///Users/saignanadeep/Desktop/Hackathon/docs/problem-statement.md) and [AssetFlow problem statement.md](file:///Users/saignanadeep/Desktop/Hackathon/docs/AssetFlow problem statement.pdfAssetFlow problem statement.md)

## 2. Design System & UI/UX
AssetFlow uses a strict, modern SaaS design system utilizing Quasar, Tailwind-like semantic styling, and the Lucide icon set.
- **Design System Spec**: [design.md](file:///Users/saignanadeep/Desktop/Hackathon/docs/design.md)
- **SCSS Variables**: [quasar.variables.scss](file:///Users/saignanadeep/Desktop/Hackathon/frontend/src/css/quasar.variables.scss)

### Critical Frontend Rules:
- **Function over Decoration**: Minimal visual noise, high data density, 8px spacing grid.
- **Typography & Icons**: Use `Inter` font and `Lucide` icons exclusively. Do not use default Material icons.
- **Color Palette**: Do NOT use default browser colors. Exclusively use the variables defined in `quasar.variables.scss` (e.g., `$primary`, `$status-available`).
- **Theming**: Ensure all components seamlessly support Quasar's Light and Dark modes.

## 3. Architecture Strictness

### Backend: Domain-Driven Design (DDD)
The backend strictly uses a Hexagonal/DDD architecture organized by bounded contexts.
**Structure:**
`backend/src/context/<bounded-context>/<module-name>/`
- `application/`: Services, Use-Cases, and DTOs.
- `infrastructure/`: Database Models (Entities), Repositories, Authentication Strategies, and Guards.
- `interface/`: GraphQL API Resolvers and Inputs.
**Rule**: Never create flat modules. Every new NestJS module MUST follow this 3-layer separation.

### Frontend: Feature-Based Architecture
The frontend strictly groups code by feature domain rather than purely by file type (like standard Vue/Quasar setups).
**Structure:**
`frontend/src/features/<feature-name>/`
- `ui/`: Vue components specific to this feature.
- `api/`: GraphQL queries, mutations, and composables for this feature.
- `stores/`: Pinia state management for this feature.
- `types/`: TypeScript interfaces.
**Rule**: Keep `src/pages` and `src/components` minimal. All heavy business logic and UI should be self-contained within `src/features/`.

## 4. General Guidelines
- Make small, incremental commits (bit by bit). Avoid massive monolithic commits.
- Never write placeholder code or "TODOs" unless explicitly requested. Provide fully functional implementations.
