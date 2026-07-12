import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './infrastructure/database/models/asset.entity';
import { AssetsService } from './application/services/assets.service';
import { AssetsResolver } from './interface/graphql-api/assets.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  providers: [AssetsService, AssetsResolver],
  exports: [AssetsService],
})
export class AssetsModule {}
