import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DashboardService } from '../../application/services/dashboard.service';
import { DashboardMetrics } from '../../application/dto/dashboard-metrics.dto';
import { JwtAuthGuard } from '../../../../identity/auth/infrastructure/guards/jwt-auth.guard';

@Resolver()
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => DashboardMetrics, { name: 'dashboardMetrics' })
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.dashboardService.getMetrics();
  }
}
