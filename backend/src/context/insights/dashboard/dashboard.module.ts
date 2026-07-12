import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './application/services/dashboard.service';
import { DashboardResolver } from './interface/graphql-api/dashboard.resolver';
import { Asset } from '../../asset-master/assets/infrastructure/database/models/asset.entity';
import { AssetAllocation } from '../../workflows/allocations/infrastructure/database/models/asset-allocation.entity';
import { ResourceBooking } from '../../workflows/bookings/infrastructure/database/models/resource-booking.entity';
import { MaintenanceRequest } from '../../workflows/maintenance/infrastructure/database/models/maintenance-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Asset,
      AssetAllocation,
      ResourceBooking,
      MaintenanceRequest,
    ]),
  ],
  providers: [DashboardService, DashboardResolver],
  exports: [DashboardService],
})
export class DashboardModule {}
