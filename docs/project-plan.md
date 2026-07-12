# AssetFlow Master Project Plan

This document outlines the detailed, high-level execution plan for the AssetFlow Enterprise Asset & Resource Management System. It breaks down the entire project into 5 core phases.

Each feature is designed as a **Full-Stack Vertical Slice**. Team members assigned to a task should build both the Backend (NestJS GraphQL Resolver) and the Frontend (Vue Composable + Quasar UI) for their assigned feature.

---

## Phase 1: Database Foundation (Completed)
- **Status**: Completed
- **Description**: Setup of the TypeORM entities, Enums, JSONB fields, and UUIDv7 primary keys across all 5 bounded contexts (`core`, `identity`, `asset-master`, `workflows`, `auditing`).

---

## Phase 2: Identity & Organization

### Task 1: Authentication & Dashboard Shell
- **Description**: Connect the app entry points and provide the main navigation structure.
- **Backend Tasks**: 
  - Verify/Finalize `AuthResolver` (Login, Me queries) and JWT guards.
- **Frontend Tasks**: 
  - Build `useAuth.ts` composable using `@vue/apollo-composable`.
  - Build `LoginPage.vue` using Quasar design tokens.
  - Build `MainLayout.vue` with dynamic sidebar navigation based on `UserRole`.
- **Assignee**: ________________________

### Task 2: Organization Setup (Admin Data)
- **Description**: The UI to manage Departments, custom Asset Categories, and Employee Roles.
- **Backend Tasks**: 
  - Build `DepartmentsResolver` (CRUD for departments).
  - Build `CategoriesResolver` (Create categories with dynamic `custom_fields_schema` JSONB).
  - Build `UsersResolver` (For promoting employees to Department Head/Asset Manager).
- **Frontend Tasks**: 
  - Build `useOrganization.ts` composable for API operations.
  - Build `OrgSetup.vue` featuring 3 Quasar tabs: Departments, Categories, Directory.
- **Assignee**: ________________________

---

## Phase 3: Core Asset Workflows

### Task 3: Asset Registration & Directory
- **Description**: Register new assets and provide a search/filter grid.
- **Backend Tasks**: 
  - Build `AssetsResolver` (Create Asset, List/Filter Assets, handling dynamic `custom_fields_data`).
- **Frontend Tasks**: 
  - Build `useAssets.ts` composable for fetching and creating assets.
  - Build `AssetDirectory.vue` (Data table with filters and "Register Asset" modal/form).
- **Assignee**: ________________________

### Task 4: Asset Allocations & Transfers
- **Description**: Manage who holds what asset and handle transfer requests.
- **Backend Tasks**: 
  - Build `AssetAllocationResolver`. 
  - *Business Logic*: Implement logic to reject allocations if the asset is already `ALLOCATED`. 
- **Frontend Tasks**: 
  - Build `useAllocations.ts` composable.
  - Build `AssetAllocation.vue` UI (Assign to user/dept, request transfers, mark as returned, capture check-in notes).
- **Assignee**: ________________________

### Task 5: Shared Resource Booking (Calendar)
- **Description**: Time-slot booking of shared resources (like meeting rooms or vehicles) with overlap protection.
- **Backend Tasks**: 
  - Build `ResourceBookingResolver`. 
  - *Business Logic*: Validate and block overlapping `start_time` and `end_time` dates.
- **Frontend Tasks**: 
  - Build `useBookings.ts` composable.
  - Build `ResourceBooking.vue` featuring a Quasar Calendar view.
- **Assignee**: ________________________

---

### Task 6: Maintenance Management (Planned)
- **Description**: Route repair requests through approval workflows.
- **Backend Tasks**: 
  - [ ] **Data Repository**: Build `MaintenanceRepository` for `MaintenanceRequest` entities.
  - [ ] **Business Logic & Side Effects**: Build `MaintenanceService` implementing:
    - Status transitions: `PENDING` -> `APPROVED` (sets `Asset.status` to `UNDER_MAINTENANCE`), `IN_PROGRESS` (when technician assigned), `RESOLVED` (sets `Asset.status` to `AVAILABLE`).
    - Audit Trail: Insert a polymorphic `activity_logs` entry of type `MAINTENANCE` for each transition.
  - [ ] **GraphQL Resolver**: Create `MaintenanceResolver` with query/mutation guards enforcing role restrictions (Employees create/view their tickets; Managers approve/assign/resolve).
  - [ ] **Module Integration**: Wire up `MaintenanceModule` with assets and activity logs.
- **Frontend Tasks**: 
  - [ ] **GraphQL Operations**: Write `maintenance.operations.graphql` queries/mutations and run `@graphql-codegen`.
  - [ ] **Composable API**: Build `useMaintenance.ts` to interface with operations.
  - [ ] **Glassmorphic UI View**: Create `MaintenancePage.vue` using Quasar `.q-card--glass`, purple semantic branding (`#a855f7` text and 10% translucent background with 6px dot), high-density grids, and conditional manager action buttons.
  - [ ] **Routing**: Map `/maintenance` in `routes.ts`.
- **Assignee**: Antigravity AI

### Task 7: Asset Audit Cycles
- **Description**: Run structured verification cycles to catch missing/damaged items.
- **Backend Tasks**: 
  - Build `AuditsResolver` (Create cycle, assign auditors, flag discrepancies).
- **Frontend Tasks**: 
  - Build `useAudits.ts` composable.
  - Build `Auditing.vue` (Cycle creation modal, auditor checklist UI).
- **Assignee**: ________________________

---

## Phase 5: Insights & Notifications

### Task 8: KPI Dashboard
- **Description**: Provide real-time operational snapshots.
- **Backend Tasks**: 
  - Build `DashboardResolver` to aggregate metrics (Total available, overdue returns, pending transfers).
- **Frontend Tasks**: 
  - Build `useDashboard.ts` composable.
  - Build `Dashboard.vue` with Quasar KPI cards and basic analytical charts.
- **Assignee**: ________________________

### Task 9: Activity Logs & Notifications
- **Description**: System-wide trail of actions.
- **Backend Tasks**: 
  - Build `ActivityLogResolver`. 
  - *Architecture*: Ensure backend services across all modules emit logs on major actions (using NestJS event emitter or direct inserts).
- **Frontend Tasks**: 
  - Build `useNotifications.ts` composable.
  - Enhance `MainLayout.vue` with a Notification Bell dropdown fetching unread logs.
- **Assignee**: ________________________
