import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ResourceBooking } from '../../infrastructure/database/models/resource-booking.entity';
import { BookingService } from '../../application/services/booking.service';
import { CreateBookingInput } from '../../application/dto/create-booking.input';
import { BookingFilterInput } from '../../application/dto/booking-filter.input';
import { Asset } from '../../../../asset-master/assets/infrastructure/database/models/asset.entity';
import { JwtAuthGuard } from '../../../../identity/auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../identity/auth/infrastructure/decorators/current-user.decorator';
import { User } from '../../../../identity/users/infrastructure/database/models/user.entity';

@Resolver(() => ResourceBooking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [ResourceBooking], { name: 'bookings' })
  async getBookings(
    @Args('filter', { nullable: true }) filter?: BookingFilterInput,
  ): Promise<ResourceBooking[]> {
    return this.bookingService.listBookings(filter || {});
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => ResourceBooking, { name: 'booking', nullable: true })
  async getBookingById(@Args('id') id: string): Promise<ResourceBooking | null> {
    return this.bookingService.getBookingById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Asset], { name: 'bookableAssets' })
  async getBookableAssets(): Promise<Asset[]> {
    return this.bookingService.listBookableAssets();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResourceBooking, { name: 'createBooking' })
  async createBooking(
    @Args('input') input: CreateBookingInput,
    @CurrentUser() user: User,
  ): Promise<ResourceBooking> {
    return this.bookingService.createBooking(input, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResourceBooking, { name: 'cancelBooking' })
  async cancelBooking(@Args('id') id: string): Promise<ResourceBooking> {
    return this.bookingService.cancelBooking(id);
  }
}
