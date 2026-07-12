import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../../infrastructure/database/repositories/categories.repository';
import { AssetCategory } from '../../infrastructure/database/models/asset-category.entity';
import { QueryArgs } from '../../../../../common/crud/base-crud.types';
import { ConnectionResult } from '../../../../../common/crud/base-repository';
import { CategoryFilterInput } from '../dto/category-filter.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
     @InjectRepository(AssetCategory)
    private readonly categoryRepository: Repository<AssetCategory>,
 

    private readonly categoriesRepository: CategoriesRepository) {}


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

  async listCategories(): Promise<AssetCategory[]> {
    return this.categoriesRepository.listAll();
  }

  async listCategoriesPage(args: QueryArgs<CategoryFilterInput>): Promise<ConnectionResult<AssetCategory>> {
    return this.categoriesRepository.findAll(args);
  }

  async getCategoryById(id: string): Promise<AssetCategory | null> {
    return this.categoriesRepository.findById(id);
  }

  async createCategory(name: string, customFieldsSchemaStr: string): Promise<AssetCategory> {
    let validSchema = customFieldsSchemaStr;
    try {
      JSON.parse(customFieldsSchemaStr);
    } catch (e) {
      validSchema = '{}';
    }

    return this.categoriesRepository.createOne({
      name,
      custom_fields_schema: validSchema,
    });
  }

  async updateCategory(id: string, name?: string, customFieldsSchema?: string): Promise<AssetCategory> {
    const category = await this.getCategoryById(id);
    if (!category) {
      throw new Error(`Category with ID ${id} not found`);
    }

    if (name !== undefined) category.name = name;
    if (customFieldsSchema !== undefined) {
      let validSchema = customFieldsSchema;
      try {
        JSON.parse(customFieldsSchema);
      } catch (e) {
        validSchema = '{}';
      }
      category.custom_fields_schema = validSchema;
    }

    const updated = await this.categoriesRepository.updateOne(id, category);
    if (!updated) {
      throw new Error(`Failed to update category with ID ${id}`);
    }
    return updated;
  }
}
