import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '../../asset-master/assets/infrastructure/database/models/asset.entity';
import { AssetAllocation } from '../../workflows/allocations/infrastructure/database/models/asset-allocation.entity';
import { ResourceBooking } from '../../workflows/bookings/infrastructure/database/models/resource-booking.entity';
import { DashboardService } from './application/services/dashboard.service';
import { DashboardResolver } from './interface/graphql-api/dashboard.resolver';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, AssetAllocation, ResourceBooking]),
    ActivityLogsModule,
  ],
  providers: [DashboardService, DashboardResolver],
})
export class DashboardModule {}
