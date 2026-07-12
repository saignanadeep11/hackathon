import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './infrastructure/database/models/activity-log.entity';
import { ActivityLogRepository } from './infrastructure/database/repositories/activity-log.repository';
import { ActivityLogService } from './application/services/activity-log.service';
import { ActivityLogResolver } from './interface/graphql-api/activity-log.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])],
  providers: [ActivityLogRepository, ActivityLogService, ActivityLogResolver],
  exports: [ActivityLogService],
})
export class ActivityLogsModule {}
