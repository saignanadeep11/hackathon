import { Module } from '@nestjs/common';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [ActivityLogsModule, DashboardModule],
  exports: [ActivityLogsModule],
})
export class AuditingModule {}
