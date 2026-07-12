import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AssetCategory } from '../../infrastructure/database/models/asset-category.entity';
import { CategoriesService } from '../../application/services/categories.service';
import { JwtAuthGuard } from '../../../../identity/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../../common/guards/roles.guard';
import { Roles } from '../../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../../common/enums/database.enums';

@Resolver(() => AssetCategory)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [AssetCategory], { name: 'categories' })
  async getCategories(): Promise<AssetCategory[]> {
    return this.categoriesService.listCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => AssetCategory, { name: 'category', nullable: true })
  async getCategoryById(@Args('id') id: string): Promise<AssetCategory | null> {
    return this.categoriesService.getCategoryById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => AssetCategory, { name: 'createCategory' })
  async createCategory(
    @Args('name') name: string,
    @Args('customFieldsSchema', { defaultValue: '{}' }) customFieldsSchema: string,
  ): Promise<AssetCategory> {
    return this.categoriesService.createCategory(name, customFieldsSchema);
  }
}
