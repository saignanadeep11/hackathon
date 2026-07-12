import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { v7 as uuidv7 } from 'uuid';
import { AllocationStatus } from '../../../../../../common/enums/database.enums';
import { Asset } from '../../../../../asset-master/assets/infrastructure/database/models/asset.entity';
import { User } from '../../../../../identity/users/infrastructure/database/models/user.entity';
import { Department } from '../../../../../identity/departments/infrastructure/database/models/department.entity';

@ObjectType()
@Entity('asset_allocations')
export class AssetAllocation {
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

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  allocated_to_user_id: string | null;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'allocated_to_user_id' })
  allocated_to_user: User | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  allocated_to_department_id: string | null;

  @Field(() => Department, { nullable: true })
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'allocated_to_department_id' })
  allocated_to_department: Department | null;

  @Field(() => String)
  @Column({ type: 'uuid' })
  requested_by_id: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'requested_by_id' })
  requested_by: User;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  expected_return_date: Date | null;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  return_date: Date | null;

  @Field(() => AllocationStatus)
  @Column({ type: 'enum', enum: AllocationStatus, default: AllocationStatus.REQUESTED })
  status: AllocationStatus;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  check_in_notes: string | null;
}
