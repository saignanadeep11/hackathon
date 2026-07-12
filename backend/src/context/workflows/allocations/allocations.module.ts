import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetAllocation } from './infrastructure/database/models/asset-allocation.entity';
import { Asset } from '../../asset-master/assets/infrastructure/database/models/asset.entity';
import { AllocationRepository } from './infrastructure/database/repositories/allocation.repository';
import { AllocationService } from './application/services/allocation.service';
import { AllocationResolver } from './interface/graphql-api/allocation.resolver';
import { ActivityLogsModule } from '../../auditing/activity-logs/activity-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([AssetAllocation, Asset]), ActivityLogsModule],
  providers: [AllocationRepository, AllocationService, AllocationResolver],
  exports: [AllocationService],
})
export class AllocationsModule {}
