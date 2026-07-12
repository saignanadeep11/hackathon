import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AssetCategory } from '../../infrastructure/database/models/asset-category.entity';
import { CategoriesService } from '../../application/services/categories.service';
import { JwtAuthGuard } from '../../../../identity/auth/infrastructure/guards/jwt-auth.guard';

@Resolver(() => AssetCategory)
@UseGuards(JwtAuthGuard)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [AssetCategory], { name: 'categories' })
  async getCategories(): Promise<AssetCategory[]> {
    return this.categoriesService.findAll();
  }

  @Mutation(() => AssetCategory)
  async createCategory(
    @Args('name') name: string,
    @Args('custom_fields_schema', { nullable: true }) custom_fields_schema?: string,
  ): Promise<AssetCategory> {
    return this.categoriesService.create(name, custom_fields_schema);
  }
}
