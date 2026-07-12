import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetCategory } from '../../infrastructure/database/models/asset-category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(AssetCategory)
    private readonly categoryRepository: Repository<AssetCategory>,
  ) {}

  async findAll(): Promise<AssetCategory[]> {
    return this.categoryRepository.find();
  }

  async create(name: string, custom_fields_schema?: string): Promise<AssetCategory> {
    const category = this.categoryRepository.create({
      name,
      custom_fields_schema: custom_fields_schema ? JSON.parse(custom_fields_schema) : {},
    });
    return this.categoryRepository.save(category);
  }
}
