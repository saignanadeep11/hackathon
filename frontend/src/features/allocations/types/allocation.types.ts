export enum AllocationStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  REJECTED = 'REJECTED',
}

export interface AllocationFilter {
  search?: string;
  status?: AllocationStatus | null;
  asset_id?: string | null;
  user_id?: string | null;
}
