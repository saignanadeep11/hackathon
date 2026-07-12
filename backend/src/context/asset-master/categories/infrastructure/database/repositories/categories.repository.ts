import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../../../../common/crud/base-repository';
import { AssetCategory } from '../models/asset-category.entity';

@Injectable()
export class CategoriesRepository extends BaseRepository<
  AssetCategory,
  any,
  any
> {
  protected dtoClass = class {} as any;
  protected sortableFields = { id: 'id', name: 'name' };
  protected rootFilterConfig = { filterableFields: { id: 'id', name: 'name' } };

  constructor(
    @InjectRepository(AssetCategory)
    protected readonly repository: Repository<AssetCategory>,
  ) {
    super();
  }

  async findById(id: string): Promise<AssetCategory | null> {
    return this.repository.findOne({ where: { id } });
  }

  async listAll(): Promise<AssetCategory[]> {
    return this.repository.find({ order: { name: 'ASC' } });
  }
}
