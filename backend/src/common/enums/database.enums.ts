import { registerEnumType } from '@nestjs/graphql';

export enum GeneralStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  ASSET_MANAGER = 'ASSET_MANAGER',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  EMPLOYEE = 'EMPLOYEE',
}

export enum AssetStatus {
  AVAILABLE = 'AVAILABLE',
  ALLOCATED = 'ALLOCATED',
  RESERVED = 'RESERVED',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  LOST = 'LOST',
  RETIRED = 'RETIRED',
  DISPOSED = 'DISPOSED',
}

export enum AllocationStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  REJECTED = 'REJECTED',
}

export enum BookingStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum MaintenancePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum MaintenanceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

export enum AuditCycleStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum AuditItemStatus {
  VERIFIED = 'VERIFIED',
  MISSING = 'MISSING',
  DAMAGED = 'DAMAGED',
}

export enum ActivityLogType {
  ALLOCATION = 'ALLOCATION',
  BOOKING = 'BOOKING',
  MAINTENANCE = 'MAINTENANCE',
  AUDIT = 'AUDIT',
}

registerEnumType(GeneralStatus, { name: 'GeneralStatus' });
registerEnumType(UserRole, { name: 'UserRole' });
registerEnumType(AssetStatus, { name: 'AssetStatus' });
registerEnumType(AllocationStatus, { name: 'AllocationStatus' });
registerEnumType(BookingStatus, { name: 'BookingStatus' });
registerEnumType(MaintenancePriority, { name: 'MaintenancePriority' });
registerEnumType(MaintenanceStatus, { name: 'MaintenanceStatus' });
registerEnumType(AuditCycleStatus, { name: 'AuditCycleStatus' });
registerEnumType(AuditItemStatus, { name: 'AuditItemStatus' });
registerEnumType(ActivityLogType, { name: 'ActivityLogType' });
