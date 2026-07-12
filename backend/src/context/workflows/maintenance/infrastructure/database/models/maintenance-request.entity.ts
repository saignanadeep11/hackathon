import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { v7 as uuidv7 } from 'uuid';
import {
  MaintenanceStatus,
  MaintenancePriority,
} from '../../../../../../common/enums/database.enums';
import { Asset } from '../../../../../asset-master/assets/infrastructure/database/models/asset.entity';
import { User } from '../../../../../identity/users/infrastructure/database/models/user.entity';

@ObjectType()
@Entity('maintenance_requests')
export class MaintenanceRequest {
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
  raised_by_user_id: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'raised_by_user_id' })
  raised_by_user: User;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  technician_name: string;

  @Field(() => String)
  @Column({ type: 'text' })
  description: string;

  @Field(() => MaintenancePriority)
  @Column({
    type: 'enum',
    enum: MaintenancePriority,
    default: MaintenancePriority.MEDIUM,
  })
  priority: MaintenancePriority;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  photo_url: string;

  @Field(() => MaintenanceStatus)
  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.PENDING,
  })
  status: MaintenanceStatus;
}
