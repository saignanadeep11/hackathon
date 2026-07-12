# AssetFlow User Workflows & Functionalities

This document defines the core functionalities for each user role and visualizes the step-by-step lifecycles of assets and requests within AssetFlow.

## 1. User Roles & Functionalities

### Admin
- **Functionalities**: Creates and manages Departments, Asset Categories, and the Employee Directory. Promotes base employees to Asset Managers or Department Heads. Can initiate and close Audit Cycles.

### Asset Manager
- **Functionalities**: Registers new assets into the system. Approves or rejects asset transfer requests, maintenance requests, and audit discrepancies. Approves asset returns and captures condition check-in notes.

### Department Head
- **Functionalities**: Views all assets assigned to their specific department. Can approve allocation and transfer requests for employees within their department. Books shared resources on behalf of the department.

### Employee (Default Role)
- **Functionalities**: Views assets currently assigned to them. Requests new assets. Books shared resources (meeting rooms, projectors, vehicles). Raises maintenance tickets for broken assets.

---

## 2. Core Workflows (Visualized)

### A. Organization Onboarding Flow
How users enter the system and gain permissions.
```mermaid
sequenceDiagram
    actor E as Employee
    actor A as Admin
    E->>System: Signs up via UI (Account defaults to 'EMPLOYEE')
    A->>System: Logs in as Admin
    A->>System: Creates Departments & Custom Asset Categories
    A->>System: Views Employee Directory
    A->>System: Promotes Employee to 'ASSET_MANAGER' or 'DEPARTMENT_HEAD'
```

### B. Asset Registration & Allocation Flow
How an asset moves from entering the system to being used and returned.
```mermaid
stateDiagram-v2
    [*] --> AVAILABLE : Asset Manager Registers Asset
    AVAILABLE --> ALLOCATED : Assigned to Employee/Department
    ALLOCATED --> REQUESTED_TRANSFER : Another user requests it
    REQUESTED_TRANSFER --> ALLOCATED : Manager Approves Transfer
    ALLOCATED --> AVAILABLE : Employee Returns Asset
```

### C. Maintenance Approval Workflow
How a broken asset gets repaired while preventing usage.
```mermaid
sequenceDiagram
    actor E as Employee
    actor M as Asset Manager
    participant S as System (Asset)
    
    E->>S: Raises Maintenance Request
    S-->>M: Dashboard Alert: Request Pending
    M->>S: Approves Request
    S->>S: Auto-updates Asset Status to UNDER_MAINTENANCE
    Note over S: Technician performs repair
    M->>S: Marks Request as Resolved
    S->>S: Auto-updates Asset Status to AVAILABLE
```

### D. Shared Resource Booking Flow
How time-slot booking prevents overlaps for shared resources.
```mermaid
flowchart TD
    A[Employee requests Date/Time Slot] --> B{System: Does it overlap with existing booking?}
    B -- Yes --> C[System Auto-Rejects Booking Request]
    B -- No --> D[Booking Confirmed - Status: UPCOMING]
    D --> E[Time Arrives - Status: ONGOING]
    E --> F[Time Ends - Status: COMPLETED]
```

### E. Audit Cycle Workflow
How the company runs structured sweeps to find missing inventory.
```mermaid
flowchart LR
    A[Admin Creates Cycle] --> B[Assigns Auditor]
    B --> C[Auditor physically verifies Assets]
    C --> D{Missing or Damaged?}
    D -- Yes --> E[Flags Discrepancy in System]
    D -- No --> F[Marks Asset Verified]
    E --> G[Admin Closes Audit Cycle]
    F --> G
    G --> H[Missing Assets automatically marked LOST]
```
