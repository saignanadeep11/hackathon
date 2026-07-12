import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../../infrastructure/database/repositories/categories.repository';
import { AssetCategory } from '../../infrastructure/database/models/asset-category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async listCategories(): Promise<AssetCategory[]> {
    return this.categoriesRepository.listAll();
  }

  async getCategoryById(id: string): Promise<AssetCategory | null> {
    return this.categoriesRepository.findById(id);
  }

  async createCategory(name: string, customFieldsSchemaStr: string): Promise<AssetCategory> {
    let customFieldsSchema = {};
    if (customFieldsSchemaStr) {
      try {
        customFieldsSchema = JSON.parse(customFieldsSchemaStr);
      } catch (e) {
        customFieldsSchema = {};
      }
    }
    return this.categoriesRepository.createOne({
      name,
      custom_fields_schema: customFieldsSchema,
    });
  }
}
