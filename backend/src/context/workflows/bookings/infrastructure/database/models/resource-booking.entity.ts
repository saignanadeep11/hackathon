import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { v7 as uuidv7 } from 'uuid';
import { BookingStatus } from '../../../../../../common/enums/database.enums';
import { Asset } from '../../../../../asset-master/assets/infrastructure/database/models/asset.entity';
import { User } from '../../../../../identity/users/infrastructure/database/models/user.entity';

@ObjectType()
@Entity('resource_bookings')
export class ResourceBooking {
  @Field(() => String)
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv7();

  @Field(() => String)
  @Column({ type: 'uuid' })
  asset_id: string;

  @Field(() => Asset)
  @ManyToOne(() => Asset)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Field(() => String)
  @Column({ type: 'uuid' })
  booked_by_user_id: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'booked_by_user_id' })
  booked_by_user: User;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  start_time: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  end_time: Date;

  @Field(() => BookingStatus)
  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.UPCOMING })
  status: BookingStatus;
}
