# AssetFlow Database Schema

All primary keys (`id`) use **UUIDv7** for sequential ordering and performance.

### 0. System & Config Context
**`number_sequences`**
- `id` (UUIDv7, PK)
- `prefix` (String, unique) - e.g., "AF"
- `current_value` (Integer) - Tracks the latest assigned number, e.g., 14
- `padding` (Integer) - e.g., 4 (results in AF-0014)

### 1. Identity & Organization Context
**`departments`**
- `id` (UUIDv7, PK)
- `name` (String)
- `status` (Enum: ACTIVE, INACTIVE)
- `parent_department_id` (UUIDv7, nullable, FK to departments)
- `head_id` (UUIDv7, nullable, FK to users)

**`users`**
- `id` (UUIDv7, PK)
- `name` (String)
- `email` (String, unique)
- `password_hash` (String)
- `role` (Enum: ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD, EMPLOYEE)
- `status` (Enum: ACTIVE, INACTIVE)
- `department_id` (UUIDv7, nullable, FK to departments)

---

### 2. Asset Master Data Context
**`asset_categories`**
- `id` (UUIDv7, PK)
- `name` (String)
- `custom_fields_schema` (JSONB) - Defines expected dynamic fields.

**`assets`**
- `id` (UUIDv7, PK)
- `asset_tag` (String, unique)
- `name` (String)
- `serial_number` (String, unique)
- `category_id` (UUIDv7, FK to asset_categories)
- `acquisition_date` (Date)
- `acquisition_cost` (Decimal)
- `condition` (String)
- `location` (String)
- `is_shared_bookable` (Boolean)
- `status` (Enum: AVAILABLE, ALLOCATED, RESERVED, UNDER_MAINTENANCE, LOST, RETIRED, DISPOSED)
- `custom_fields_data` (JSONB) - Actual values matching the category schema.

---

### 3. Core Workflows Context
**`asset_allocations`**
- `id` (UUIDv7, PK)
- `asset_id` (UUIDv7, FK to assets)
- `allocated_to_user_id` (UUIDv7, nullable, FK to users)
- `allocated_to_department_id` (UUIDv7, nullable, FK to departments)
- `requested_by_id` (UUIDv7, FK to users)
- `expected_return_date` (Date, nullable)
- `return_date` (Date, nullable)
- `status` (Enum: REQUESTED, APPROVED, ACTIVE, RETURNED, REJECTED)
- `check_in_notes` (String, nullable)

**`resource_bookings`**
- `id` (UUIDv7, PK)
- `asset_id` (UUIDv7, FK to assets)
- `booked_by_user_id` (UUIDv7, FK to users)
- `start_time` (Timestamp)
- `end_time` (Timestamp)
- `status` (Enum: UPCOMING, ONGOING, COMPLETED, CANCELLED)

**`maintenance_requests`**
- `id` (UUIDv7, PK)
- `asset_id` (UUIDv7, FK to assets)
- `raised_by_user_id` (UUIDv7, FK to users)
- `technician_name` (String, nullable)
- `description` (String)
- `priority` (Enum: LOW, MEDIUM, HIGH, CRITICAL)
- `photo_url` (String, nullable)
- `status` (Enum: PENDING, APPROVED, REJECTED, IN_PROGRESS, RESOLVED)

---

### 4. Auditing & Notifications Context
**`audit_cycles`**
- `id` (UUIDv7, PK)
- `name` (String)
- `target_department_id` (UUIDv7, nullable, FK to departments)
- `start_date` (Date)
- `end_date` (Date)
- `status` (Enum: OPEN, CLOSED)

**`audit_items`**
- `id` (UUIDv7, PK)
- `audit_cycle_id` (UUIDv7, FK to audit_cycles)
- `asset_id` (UUIDv7, FK to assets)
- `auditor_id` (UUIDv7, FK to users)
- `verification_status` (Enum: VERIFIED, MISSING, DAMAGED)
- `notes` (String, nullable)

**`activity_logs`**
- `id` (UUIDv7, PK)
- `type` (Enum: ALLOCATION, BOOKING, MAINTENANCE, AUDIT)
- `message` (String)
- `actor_id` (UUIDv7, FK to users)
- `target_user_id` (UUIDv7, nullable, FK to users)
- `entity_id` (UUIDv7) - Polymorphic reference
- `is_read` (Boolean, default: false)
- `created_at` (Timestamp)
