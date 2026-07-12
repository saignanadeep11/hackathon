import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../../../../common/crud/base-repository';
import { AssetAllocation } from '../models/asset-allocation.entity';

@Injectable()
export class AllocationRepository extends BaseRepository<AssetAllocation, any, any> {
  protected dtoClass = class {} as any;
  protected sortableFields = { id: 'id' };
  protected rootFilterConfig = { filterableFields: { id: 'id', status: 'status' } };

  constructor(
    @InjectRepository(AssetAllocation)
    protected readonly repository: Repository<AssetAllocation>,
  ) {
    super();
  }

  async findById(id: string): Promise<AssetAllocation | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        asset: true,
        allocated_to_user: true,
        allocated_to_department: true,
        requested_by: true,
      },
    });
  }

  async listAll(filters: {
    status?: string;
    asset_id?: string;
    user_id?: string;
    search?: string;
  }): Promise<AssetAllocation[]> {
    const qb = this.repository.createQueryBuilder('allocation');
    qb.leftJoinAndSelect('allocation.asset', 'asset')
      .leftJoinAndSelect('allocation.allocated_to_user', 'allocated_to_user')
      .leftJoinAndSelect('allocation.allocated_to_department', 'allocated_to_department')
      .leftJoinAndSelect('allocation.requested_by', 'requested_by');

    if (filters.status) {
      qb.andWhere('allocation.status = :status', { status: filters.status });
    }

    if (filters.asset_id) {
      qb.andWhere('allocation.asset_id = :asset_id', { asset_id: filters.asset_id });
    }

    if (filters.user_id) {
      qb.andWhere('allocation.allocated_to_user_id = :user_id', { user_id: filters.user_id });
    }

    if (filters.search) {
      qb.andWhere(
        '(asset.name ILIKE :search OR asset.asset_tag ILIKE :search OR allocated_to_user.name ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Since we don't have createdAt, let's sort by id DESC (since UUIDv7 contains timestamp, it's chronologically ordered!)
    qb.orderBy('allocation.id', 'DESC');

    return qb.getMany();
  }
}
