import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetCategory } from './infrastructure/database/models/asset-category.entity';
import { CategoriesService } from './application/services/categories.service';
import { CategoriesResolver } from './interface/graphql-api/categories.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([AssetCategory])],
  providers: [CategoriesService, CategoriesResolver],
  exports: [CategoriesService],
})
export class CategoriesModule {}
