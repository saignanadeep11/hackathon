# AssetFlow - Enterprise Asset & Resource Management System

AssetFlow is a centralized ERP platform designed to simplify and digitize how organizations track, allocate, and maintain their physical assets and shared resources. It eliminates manual tracking inefficiencies by enabling structured asset lifecycles, centralized resource booking, and real-time visibility into asset conditions and allocations.

## 🚀 Vision
To provide a clean, domain-driven ERP platform with role-based workflows and scalable module design, completely decoupled from standard purchasing or accounting concerns, making it applicable to any organization (offices, schools, hospitals, factories).

---

## 🛠 Technology Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/)
- **API**: GraphQL (Code-first approach)
- **Database**: PostgreSQL (via TypeORM)
- **Architecture**: Domain-Driven Design (DDD) / Hexagonal Architecture

### Frontend
- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **UI Toolkit**: [Quasar Framework](https://quasar.dev/)
- **State Management**: Pinia
- **API Client**: Apollo GraphQL

---

## 🏗 Architecture Strictness

- **Backend (DDD)**: The backend is organized into bounded contexts (`core`, `identity`, `asset-master`, `workflows`, `auditing`). Every module follows a strict 3-layer separation:
  - `application/`: Services, Use-Cases, and DTOs.
  - `infrastructure/`: Database Models (Entities), Repositories.
  - `interface/`: GraphQL API Resolvers.
- **Frontend (Feature-Based)**: Code is grouped by feature domain (e.g., `features/maintenance/`) instead of purely by file type. Each feature directory contains its own `ui/`, `api/`, `stores/`, and `types/`.

---

## 📋 Detailed Scope & Core Workflows

### 1. Identity & Organization Setup
- **Realistic Authentication**: Standard signup creates an "Employee" account. Users cannot self-elevate roles.
- **Master Data Management**: Admins can manage Departments, Asset Categories (with dynamic custom schemas), and the Employee Directory.
- **Role Assignment**: Admins exclusively promote standard Employees to `Department Head` or `Asset Manager`.

### 2. Asset Registration & Directory
- **Lifecycle Tracking**: Track assets through explicit states: `Available`, `Allocated`, `Reserved`, `Under Maintenance`, `Lost`, `Retired`, `Disposed`.
- **Dynamic Attributes**: Register assets with category-specific custom fields, serial numbers, conditions, and exact locations.

### 3. Asset Allocation & Transfers
- **Strict Conflict Handling**: The system enforces business logic to prevent double-allocation of a single asset.
- **Transfer Workflow**: If an asset is already allocated, employees must initiate a 'Transfer Request' which follows a structured approval chain.

### 4. Shared Resource Booking
- **Calendar Management**: Time-slot based booking of shared resources (like meeting rooms or vehicles).
- **Overlap Validation**: The backend validates and actively blocks overlapping `start_time` and `end_time` requests to prevent double-booking.

### 5. Maintenance Management
- **Repair Workflows**: Route repair requests through an approval pipeline (`Pending` → `Approved` → `In Progress` → `Resolved`).
- **Automated Side-Effects**: Approving a request automatically transitions the associated asset's status to `Under Maintenance`, locking it from allocation until resolved.

### 6. Asset Audit Cycles (Planned)
- **Verification Cycles**: Create audit cycles assigned to specific departments/locations.
- **Auditor Checklists**: Assigned auditors verify assets, flagging missing or damaged items, auto-generating discrepancy reports.

### 7. Insights & Notifications
- **KPI Dashboard**: Real-time snapshot of metrics (Total Available, Overdue Returns, Pending Transfers).
- **Activity Logs**: System-wide trail of actions recording exactly who did what and when.

---

## 👥 User Roles

1. **Admin**: Sets up master data (Departments, Categories) and manages Role assignments. Views global analytics.
2. **Asset Manager**: Registers assets, approves transfers, handles maintenance requests, and resolves audit discrepancies.
3. **Department Head**: Views assets allocated to their department, approves internal transfer requests.
4. **Employee**: Can view their allocated assets, book shared resources, and raise maintenance requests.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Ensure your database is running and credentials match `backend/.env`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Hackathon
   ```

2. **Install all dependencies:**
   The project is set up as a monorepo. You can install all dependencies for both frontend and backend from the root directory:
   ```bash
   npm run install:all
   ```

### Running the Application

You can run both the frontend and backend concurrently from the root directory:

```bash
npm run dev
```

Alternatively, you can run them separately from the root:
```bash
npm run dev:backend
npm run dev:frontend
```

### Database Migrations & Seeding
To run migrations and seed initial data:
```bash
cd backend
npm run migration:run
```

---

## 🎨 Design System
AssetFlow utilizes a strict, modern SaaS design system based on Quasar, featuring glassmorphism, high data density grids, and the Lucide icon set. All colors are strictly governed by CSS variables defined in `quasar.variables.scss`.
