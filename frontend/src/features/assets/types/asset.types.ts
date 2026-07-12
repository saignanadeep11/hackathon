export enum AssetStatus {
  AVAILABLE = 'AVAILABLE',
  ALLOCATED = 'ALLOCATED',
  RESERVED = 'RESERVED',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  LOST = 'LOST',
  RETIRED = 'RETIRED',
  DISPOSED = 'DISPOSED',
}

export interface AssetFilter {
  search?: string;
  status?: AssetStatus | null;
  category_id?: string | null;
  location?: string;
  is_shared_bookable?: boolean | null;
}
