import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../../../../asset-master/assets/infrastructure/database/models/asset.entity';
import { AssetAllocation } from '../../../../workflows/allocations/infrastructure/database/models/asset-allocation.entity';
import { ResourceBooking } from '../../../../workflows/bookings/infrastructure/database/models/resource-booking.entity';
import { ActivityLogService } from '../../../activity-logs/application/services/activity-log.service';
import { DashboardMetrics } from '../dto/dashboard-metrics.dto';
import { AssetStatus, AllocationStatus, BookingStatus } from '../../../../../common/enums/database.enums';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
    @InjectRepository(AssetAllocation)
    private readonly allocationRepo: Repository<AssetAllocation>,
    @InjectRepository(ResourceBooking)
    private readonly bookingRepo: Repository<ResourceBooking>,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async getMetrics(): Promise<DashboardMetrics> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [
      totalAssets,
      availableAssets,
      allocatedAssets,
      underMaintenanceAssets,
      pendingAllocationRequests,
      overdueAllocations,
      upcomingBookingsToday,
      totalBookings,
      recentActivityLogs,
    ] = await Promise.all([
      this.assetRepo.count(),
      this.assetRepo.count({ where: { status: AssetStatus.AVAILABLE } }),
      this.assetRepo.count({ where: { status: AssetStatus.ALLOCATED } }),
      this.assetRepo.count({ where: { status: AssetStatus.UNDER_MAINTENANCE } }),
      this.allocationRepo.count({ where: { status: AllocationStatus.REQUESTED } }),
      this.allocationRepo.createQueryBuilder('a')
        .where('a.status IN (:...statuses)', { statuses: [AllocationStatus.APPROVED, AllocationStatus.ACTIVE] })
        .andWhere('a.expected_return_date IS NOT NULL')
        .andWhere('a.expected_return_date < :today', { today })
        .getCount(),
      this.bookingRepo.createQueryBuilder('b')
        .where('b.status = :status', { status: BookingStatus.UPCOMING })
        .andWhere('b.start_time >= :today', { today })
        .andWhere('b.start_time < :tomorrow', { tomorrow })
        .getCount(),
      this.bookingRepo.count(),
      this.activityLogService.getRecentLogs(10),
    ]);

    return {
      totalAssets,
      availableAssets,
      allocatedAssets,
      underMaintenanceAssets,
      pendingAllocationRequests,
      overdueAllocations,
      upcomingBookingsToday,
      totalBookings,
      recentActivityLogs,
    };
  }
}
