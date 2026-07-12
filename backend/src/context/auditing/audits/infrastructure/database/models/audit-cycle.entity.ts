import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { v7 as uuidv7 } from 'uuid';
import { AuditCycleStatus } from '../../../../../../common/enums/database.enums';
import { Department } from '../../../../../identity/departments/infrastructure/database/models/department.entity';
import { AuditItem } from './audit-item.entity';


@ObjectType()
@Entity('audit_cycles')
export class AuditCycle {
  @Field(() => String)
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv7();

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  target_department_id: string;

  @Field(() => Department, { nullable: true })
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'target_department_id' })
  target_department: Department;

  @Field(() => Date)
  @Column({ type: 'date' })
  start_date: Date;

  @Field(() => Date)
  @Column({ type: 'date' })
  end_date: Date;

  @Field(() => AuditCycleStatus)
  @Column({ type: 'enum', enum: AuditCycleStatus, default: AuditCycleStatus.OPEN })
  status: AuditCycleStatus;

  @Field(() => [AuditItem], { nullable: true })
  @OneToMany(() => AuditItem, item => item.audit_cycle)
  items: AuditItem[];
}
