import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceBooking } from '../../infrastructure/database/models/resource-booking.entity';
import { BookingRepository } from '../../infrastructure/database/repositories/booking.repository';
import { Asset } from '../../../../asset-master/assets/infrastructure/database/models/asset.entity';
import { BookingStatus, ActivityLogType } from '../../../../../common/enums/database.enums';
import { CreateBookingInput } from '../dto/create-booking.input';
import { ActivityLogService } from '../../../../auditing/activity-logs/application/services/activity-log.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepo: BookingRepository,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async listBookings(filters: {
    status?: string;
    asset_id?: string;
    user_id?: string;
    search?: string;
  }): Promise<ResourceBooking[]> {
    return this.bookingRepo.listAll(filters);
  }

  async getBookingById(id: string): Promise<ResourceBooking | null> {
    return this.bookingRepo.findById(id);
  }

  async createBooking(input: CreateBookingInput, bookedByUserId: string): Promise<ResourceBooking> {
    const asset = await this.assetRepository.findOne({ where: { id: input.asset_id } });
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${input.asset_id} not found`);
    }

    if (!asset.is_shared_bookable) {
      throw new BadRequestException(`Asset "${asset.name}" is not designated as a shared bookable resource`);
    }

    const start = new Date(input.start_time);
    const end = new Date(input.end_time);

    if (start >= end) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Overlap protection logic
    const overlapping = await this.bookingRepo.findOverlapping(input.asset_id, start, end);
    if (overlapping.length > 0) {
      throw new ConflictException(`The requested time slot overlaps with an existing booking for "${asset.name}"`);
    }

    const bookingData: Partial<ResourceBooking> = {
      asset_id: input.asset_id,
      booked_by_user_id: bookedByUserId,
      start_time: start,
      end_time: end,
      status: BookingStatus.UPCOMING,
    };

    const booking = await this.bookingRepo.createOne(bookingData);

    await this.activityLogService.emitLog(
      ActivityLogType.BOOKING,
      `Resource "${asset.name}" booked from ${start.toISOString()} to ${end.toISOString()}`,
      bookedByUserId,
      booking.id,
    );

    return booking;
  }

  async cancelBooking(id: string): Promise<ResourceBooking> {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException(`Cannot cancel a booking that is already ${booking.status}`);
    }

    booking.status = BookingStatus.CANCELLED;
    const cancelled = await this.bookingRepo.createOne(booking);

    await this.activityLogService.emitLog(
      ActivityLogType.BOOKING,
      `Booking for asset cancelled`,
      booking.booked_by_user_id,
      cancelled.id,
    );

    return cancelled;
  }

  async listBookableAssets(): Promise<Asset[]> {
    return this.assetRepository.find({
      where: { is_shared_bookable: true },
      order: { name: 'ASC' },
    });
  }
}
