import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLogType } from '../../../../../../common/enums/database.enums';
import { ActivityLog } from '../models/activity-log.entity';
import { ActivityLogFilterInput } from '../../../application/dto/activity-log-filter.input';

@Injectable()
export class ActivityLogRepository {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly repo: Repository<ActivityLog>,
  ) {}

  async listAll(filter: ActivityLogFilterInput, limit = 50): Promise<ActivityLog[]> {
    const qb = this.repo.createQueryBuilder('log')
      .leftJoinAndSelect('log.actor', 'actor')
      .leftJoinAndSelect('log.target_user', 'target_user')
      .orderBy('log.created_at', 'DESC')
      .take(limit);

    if (filter.type !== undefined) {
      qb.andWhere('log.type = :type', { type: filter.type });
    }
    if (filter.is_read !== undefined) {
      qb.andWhere('log.is_read = :is_read', { is_read: filter.is_read });
    }
    if (filter.actor_id) {
      qb.andWhere('log.actor_id = :actor_id', { actor_id: filter.actor_id });
    }

    return qb.getMany();
  }

  async getUnreadCountForUser(userId: string): Promise<number> {
    return this.repo.createQueryBuilder('log')
      .where('log.is_read = :is_read', { is_read: false })
      .andWhere('(log.actor_id = :userId OR log.target_user_id = :userId)', { userId })
      .getCount();
  }

  async createOne(data: Partial<ActivityLog>): Promise<ActivityLog> {
    const log = this.repo.create(data);
    return this.repo.save(log);
  }

  async markAllReadForUser(userId: string): Promise<void> {
    await this.repo.createQueryBuilder()
      .update(ActivityLog)
      .set({ is_read: true })
      .where('(actor_id = :userId OR target_user_id = :userId)', { userId })
      .andWhere('is_read = false')
      .execute();
  }

  async listRecent(limit = 10): Promise<ActivityLog[]> {
    return this.repo.find({
      relations: { actor: true },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async emitLog(
    type: ActivityLogType,
    message: string,
    actorId: string,
    entityId: string,
    targetUserId?: string,
  ): Promise<ActivityLog> {
    return this.createOne({
      type,
      message,
      actor_id: actorId,
      entity_id: entityId,
      target_user_id: targetUserId ?? undefined,
      is_read: false,
    });
  }
}
