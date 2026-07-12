import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThanOrEqual } from 'typeorm';
import { Asset } from '../../../../asset-master/assets/infrastructure/database/models/asset.entity';
import { AssetAllocation } from '../../../../workflows/allocations/infrastructure/database/models/asset-allocation.entity';
import { ResourceBooking } from '../../../../workflows/bookings/infrastructure/database/models/resource-booking.entity';
import { MaintenanceRequest } from '../../../../workflows/maintenance/infrastructure/database/models/maintenance-request.entity';
import { AssetStatus, AllocationStatus, BookingStatus, MaintenanceStatus } from '../../../../../common/enums/database.enums';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
    @InjectRepository(AssetAllocation)
    private readonly allocationRepo: Repository<AssetAllocation>,
    @InjectRepository(ResourceBooking)
    private readonly bookingRepo: Repository<ResourceBooking>,
    @InjectRepository(MaintenanceRequest)
    private readonly maintenanceRepo: Repository<MaintenanceRequest>,
  ) {}

  async getMetrics() {
    // Generate YYYY-MM-DD string for exact date comparison against SQL 'date' type
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const [
      assetsAvailable,
      assetsAllocated,
      maintenanceToday,
      activeBookings,
      pendingTransfers,
      upcomingReturns,
      overdueReturns,
    ] = await Promise.all([
      this.assetRepo.count({ where: { status: AssetStatus.AVAILABLE } }),
      this.assetRepo.count({ where: { status: AssetStatus.ALLOCATED } }),
      this.maintenanceRepo.count({
        where: [
          { status: MaintenanceStatus.PENDING },
          { status: MaintenanceStatus.IN_PROGRESS }
        ]
      }),
      this.bookingRepo.count({ where: { status: BookingStatus.ONGOING } }),
      this.allocationRepo.count({ where: { status: AllocationStatus.REQUESTED } }),
      this.allocationRepo.count({
        where: {
          status: AllocationStatus.ACTIVE,
          expected_return_date: MoreThanOrEqual(todayStr as any),
        }
      }),
      this.allocationRepo.count({
        where: {
          status: AllocationStatus.ACTIVE,
          expected_return_date: LessThan(todayStr as any),
        }
      }),
    ]);

    return {
      assetsAvailable,
      assetsAllocated,
      maintenanceToday,
      activeBookings,
      pendingTransfers,
      upcomingReturns,
      overdueReturns,
    };
  }
}
