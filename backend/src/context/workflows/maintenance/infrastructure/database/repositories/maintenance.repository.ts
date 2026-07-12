import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../../../../common/crud/base-repository';
import { MaintenanceRequest } from '../models/maintenance-request.entity';

@Injectable()
export class MaintenanceRepository extends BaseRepository<
  MaintenanceRequest,
  any,
  any
> {
  protected dtoClass = class {} as any;
  protected sortableFields = { id: 'id', createdAt: 'createdAt' };
  protected rootFilterConfig = {
    filterableFields: {
      id: 'id',
      asset_id: 'asset_id',
      status: 'status',
      priority: 'priority',
    },
  };

  constructor(
    @InjectRepository(MaintenanceRequest)
    protected readonly repository: Repository<MaintenanceRequest>,
  ) {
    super();
  }

  async findById(id: string): Promise<MaintenanceRequest | null> {
    return this.repository.findOne({
      where: { id },
      relations: { asset: true, raised_by_user: true },
    });
  }

  async listAll(filters: {
    asset_id?: string;
    status?: string;
    priority?: string;
  }): Promise<MaintenanceRequest[]> {
    const qb = this.repository.createQueryBuilder('mr');
    qb.leftJoinAndSelect('mr.asset', 'asset');
    qb.leftJoinAndSelect('mr.raised_by_user', 'user');

    if (filters.asset_id) {
      qb.andWhere('mr.asset_id = :asset_id', { asset_id: filters.asset_id });
    }

    if (filters.status) {
      qb.andWhere('mr.status = :status', { status: filters.status });
    }

    if (filters.priority) {
      qb.andWhere('mr.priority = :priority', { priority: filters.priority });
    }

    qb.orderBy('mr.id', 'DESC');

    return qb.getMany();
  }
}
