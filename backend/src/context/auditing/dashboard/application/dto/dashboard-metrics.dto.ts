import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ActivityLog } from '../../../activity-logs/infrastructure/database/models/activity-log.entity';

@ObjectType()
export class DashboardMetrics {
  @Field(() => Int)
  totalAssets: number;

  @Field(() => Int)
  availableAssets: number;

  @Field(() => Int)
  allocatedAssets: number;

  @Field(() => Int)
  underMaintenanceAssets: number;

  @Field(() => Int)
  pendingAllocationRequests: number;

  @Field(() => Int)
  overdueAllocations: number;

  @Field(() => Int)
  upcomingBookingsToday: number;

  @Field(() => Int)
  totalBookings: number;

  @Field(() => [ActivityLog])
  recentActivityLogs: ActivityLog[];
}
