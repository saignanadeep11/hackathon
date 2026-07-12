import { Module } from '@nestjs/common';
import { AllocationsModule } from './allocations/allocations.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [AllocationsModule, BookingsModule],
  exports: [AllocationsModule, BookingsModule],
})
export class WorkflowsModule {}
