import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceBooking } from './infrastructure/database/models/resource-booking.entity';
import { Asset } from '../../asset-master/assets/infrastructure/database/models/asset.entity';
import { BookingRepository } from './infrastructure/database/repositories/booking.repository';
import { BookingService } from './application/services/booking.service';
import { BookingResolver } from './interface/graphql-api/booking.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceBooking, Asset])],
  providers: [BookingRepository, BookingService, BookingResolver],
  exports: [BookingService],
})
export class BookingsModule {}
