import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { v7 as uuidv7 } from 'uuid';
import { AuditItemStatus } from '../../../../../../common/enums/database.enums';
import { AuditCycle } from './audit-cycle.entity';
import { Asset } from '../../../../../asset-master/assets/infrastructure/database/models/asset.entity';
import { User } from '../../../../../identity/users/infrastructure/database/models/user.entity';

@ObjectType()
@Entity('audit_items')
export class AuditItem {
  @Field(() => String)
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv7();

  @Field(() => String)
  @Column({ type: 'uuid' })
  audit_cycle_id: string;

  @Field(() => AuditCycle)
  @ManyToOne(() => AuditCycle, (cycle) => cycle.items)
  @JoinColumn({ name: 'audit_cycle_id' })
  audit_cycle: AuditCycle;

  @Field(() => String)
  @Column({ type: 'uuid' })
  asset_id: string;

  @Field(() => Asset)
  @ManyToOne(() => Asset)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Field(() => String)
  @Column({ type: 'uuid' })
  auditor_id: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'auditor_id' })
  auditor: User;

  @Field(() => AuditItemStatus)
  @Column({
    type: 'enum',
    enum: AuditItemStatus,
    default: AuditItemStatus.VERIFIED,
  })
  verification_status: AuditItemStatus;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  notes: string;
}
