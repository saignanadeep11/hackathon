import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [CategoriesModule, AssetsModule],
  exports: [CategoriesModule, AssetsModule],
})
export class AssetMasterModule {}
