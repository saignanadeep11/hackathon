export enum BookingStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface BookingFilter {
  search?: string;
  status?: BookingStatus | null;
  asset_id?: string | null;
  user_id?: string | null;
}
