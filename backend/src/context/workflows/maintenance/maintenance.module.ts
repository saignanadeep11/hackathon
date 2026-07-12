import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceRequest } from './infrastructure/database/models/maintenance-request.entity';
import { Asset } from '../../asset-master/assets/infrastructure/database/models/asset.entity';
import { ActivityLog } from '../../auditing/activity-logs/infrastructure/database/models/activity-log.entity';
import { MaintenanceRepository } from './infrastructure/database/repositories/maintenance.repository';
import { MaintenanceService } from './application/maintenance.service';
import { MaintenanceResolver } from './interface/graphql-api/maintenance.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([MaintenanceRequest, Asset, ActivityLog]),
  ],
  providers: [
    MaintenanceResolver,
    MaintenanceService,
    MaintenanceRepository,
  ],
  exports: [
    MaintenanceService,
    MaintenanceRepository,
  ],
})
export class MaintenanceModule {}
