import { Resolver, Query, ObjectType, Field, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../identity/auth/infrastructure/guards/jwt-auth.guard';
import { DashboardService } from '../../application/services/dashboard.service';

@ObjectType()
export class DashboardMetrics {
  @Field(() => Int)
  assetsAvailable: number;

  @Field(() => Int)
  assetsAllocated: number;

  @Field(() => Int)
  maintenanceToday: number;

  @Field(() => Int)
  activeBookings: number;

  @Field(() => Int)
  pendingTransfers: number;

  @Field(() => Int)
  upcomingReturns: number;

  @Field(() => Int)
  overdueReturns: number;
}

@Resolver()
@UseGuards(JwtAuthGuard)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => DashboardMetrics, { name: 'dashboardMetrics' })
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.dashboardService.getMetrics();
  }
}
