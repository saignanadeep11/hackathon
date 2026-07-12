import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { v7 as uuidv7 } from 'uuid';
import { ActivityLogType } from '../../../../../../common/enums/database.enums';
import { User } from '../../../../../identity/users/infrastructure/database/models/user.entity';

@ObjectType()
@Entity('activity_logs')
export class ActivityLog {
  @Field(() => String)
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv7();

  @Field(() => ActivityLogType)
  @Column({ type: 'enum', enum: ActivityLogType })
  type: ActivityLogType;

  @Field(() => String)
  @Column({ type: 'text' })
  message: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  actor_id: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'actor_id' })
  actor: User;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  target_user_id: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'target_user_id' })
  target_user: User;

  // Polymorphic ID (could belong to booking, maintenance, etc.)
  @Field(() => String)
  @Column({ type: 'uuid' })
  entity_id: string;

  @Field(() => Boolean)
  @Column({ default: false })
  is_read: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;
}
