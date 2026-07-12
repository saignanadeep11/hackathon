import { Module } from '@nestjs/common';
import { AllocationsModule } from './allocations/allocations.module';
import { BookingsModule } from './bookings/bookings.module';
import { AuditingModule } from '../auditing/auditing.module';

@Module({
  imports: [AuditingModule, AllocationsModule, BookingsModule],
  exports: [AllocationsModule, BookingsModule],
})
export class WorkflowsModule {}
