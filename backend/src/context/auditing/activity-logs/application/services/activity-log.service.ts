import { Injectable } from '@nestjs/common';
import { ActivityLog } from '../../infrastructure/database/models/activity-log.entity';
import { ActivityLogRepository } from '../../infrastructure/database/repositories/activity-log.repository';
import { ActivityLogFilterInput } from '../dto/activity-log-filter.input';
import { ActivityLogType } from '../../../../../common/enums/database.enums';

@Injectable()
export class ActivityLogService {
  constructor(private readonly activityLogRepo: ActivityLogRepository) {}

  async getLogs(filter: ActivityLogFilterInput): Promise<ActivityLog[]> {
    return this.activityLogRepo.listAll(filter);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.activityLogRepo.getUnreadCountForUser(userId);
  }

  async markAllRead(userId: string): Promise<boolean> {
    await this.activityLogRepo.markAllReadForUser(userId);
    return true;
  }

  async getRecentLogs(limit = 10): Promise<ActivityLog[]> {
    return this.activityLogRepo.listRecent(limit);
  }

  /**
   * Emit an activity log entry. Called by workflow services after state mutations.
   */
  async emitLog(
    type: ActivityLogType,
    message: string,
    actorId: string,
    entityId: string,
    targetUserId?: string,
  ): Promise<void> {
    await this.activityLogRepo.emitLog(type, message, actorId, entityId, targetUserId);
  }
}
