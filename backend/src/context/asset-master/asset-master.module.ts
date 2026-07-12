import { Module } from '@nestjs/common';
import { AssetsModule } from './assets/assets.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [AssetsModule, CategoriesModule],
  exports: [AssetsModule, CategoriesModule],
})
export class AssetMasterModule {}
