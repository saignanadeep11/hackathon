import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../../../../common/crud/base-repository';
import { ResourceBooking } from '../models/resource-booking.entity';
import { BookingStatus } from '../../../../../../common/enums/database.enums';

@Injectable()
export class BookingRepository extends BaseRepository<ResourceBooking, any, any> {
  protected dtoClass = class {} as any;
  protected sortableFields = { id: 'id' };
  protected rootFilterConfig = { filterableFields: { id: 'id', status: 'status' } };

  constructor(
    @InjectRepository(ResourceBooking)
    protected readonly repository: Repository<ResourceBooking>,
  ) {
    super();
  }

  async findById(id: string): Promise<ResourceBooking | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        asset: true,
        booked_by_user: true,
      },
    });
  }

  async listAll(filters: {
    status?: string;
    asset_id?: string;
    user_id?: string;
    search?: string;
  }): Promise<ResourceBooking[]> {
    const qb = this.repository.createQueryBuilder('booking');
    qb.leftJoinAndSelect('booking.asset', 'asset')
      .leftJoinAndSelect('booking.booked_by_user', 'booked_by_user');

    if (filters.status) {
      qb.andWhere('booking.status = :status', { status: filters.status });
    }

    if (filters.asset_id) {
      qb.andWhere('booking.asset_id = :asset_id', { asset_id: filters.asset_id });
    }

    if (filters.user_id) {
      qb.andWhere('booking.booked_by_user_id = :user_id', { user_id: filters.user_id });
    }

    if (filters.search) {
      qb.andWhere(
        '(asset.name ILIKE :search OR asset.asset_tag ILIKE :search OR booked_by_user.name ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Sort by id DESC (UUIDv7 sequential)
    qb.orderBy('booking.id', 'DESC');

    return qb.getMany();
  }

  async findOverlapping(assetId: string, startTime: Date, endTime: Date): Promise<ResourceBooking[]> {
    return this.repository.createQueryBuilder('booking')
      .where('booking.asset_id = :assetId', { assetId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.UPCOMING, BookingStatus.ONGOING],
      })
      .andWhere('booking.start_time < :endTime AND booking.end_time > :startTime', {
        startTime,
        endTime,
      })
      .getMany();
  }
}
