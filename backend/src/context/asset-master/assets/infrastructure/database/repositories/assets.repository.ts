import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../../../../common/crud/base-repository';
import { Asset } from '../models/asset.entity';

@Injectable()
export class AssetsRepository extends BaseRepository<Asset, any, any> {
  protected dtoClass = class {} as any;
  protected sortableFields = { id: 'id', asset_tag: 'asset_tag', name: 'name', createdAt: 'createdAt' };
  protected rootFilterConfig = { filterableFields: { id: 'id', asset_tag: 'asset_tag', status: 'status' } };

  constructor(
    @InjectRepository(Asset)
    protected readonly repository: Repository<Asset>,
  ) {
    super();
  }

  async findById(id: string): Promise<Asset | null> {
    return this.repository.findOne({
      where: { id } as any,
      relations: { category: true },
    });
  }

  async findByTag(asset_tag: string): Promise<Asset | null> {
    return this.repository.findOne({
      where: { asset_tag } as any,
      relations: { category: true },
    });
  }

  async listAll(filters: {
    search?: string;
    status?: string;
    category_id?: string;
    location?: string;
    is_shared_bookable?: boolean;
  }): Promise<Asset[]> {
    const qb = this.repository.createQueryBuilder('asset');
    qb.leftJoinAndSelect('asset.category', 'category');

    if (filters.status) {
      qb.andWhere('asset.status = :status', { status: filters.status });
    }

    if (filters.category_id) {
      qb.andWhere('asset.category_id = :category_id', { category_id: filters.category_id });
    }

    if (filters.is_shared_bookable !== undefined) {
      qb.andWhere('asset.is_shared_bookable = :is_shared_bookable', {
        is_shared_bookable: filters.is_shared_bookable,
      });
    }

    if (filters.location) {
      qb.andWhere('asset.location ILIKE :location', { location: `%${filters.location}%` });
    }

    if (filters.search) {
      qb.andWhere(
        '(asset.name ILIKE :search OR asset.asset_tag ILIKE :search OR asset.serial_number ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    qb.orderBy('asset.createdAt', 'DESC');

    return qb.getMany();
  }
}
