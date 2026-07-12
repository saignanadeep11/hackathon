import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './infrastructure/database/models/asset.entity';
import { AssetsRepository } from './infrastructure/database/repositories/assets.repository';
import { AssetsService } from './application/services/assets.service';
import { AssetsResolver } from './interface/graphql-api/assets.resolver';
import { NumberSequencesModule } from '../../core/number-sequences/number-sequences.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset]),
    NumberSequencesModule,
  ],
  providers: [AssetsResolver, AssetsService, AssetsRepository],
  exports: [AssetsService, AssetsRepository],
})
export class AssetsModule {}
