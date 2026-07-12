import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { v7 as uuidv7 } from 'uuid';
import { GeneralStatus } from '../../../../../../common/enums/database.enums';
import { User } from '../../../../users/infrastructure/database/models/user.entity';

@ObjectType()
@Entity('departments')
export class Department {
  @Field(() => String)
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv7();

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => GeneralStatus)
  @Column({ type: 'enum', enum: GeneralStatus, default: GeneralStatus.ACTIVE })
  status: GeneralStatus;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  parent_department_id: string;

  @Field(() => Department, { nullable: true })
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'parent_department_id' })
  parent_department: Department;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  head_id: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'head_id' })
  head: User;

  @Field(() => [User], { nullable: true })
  @OneToMany(() => User, (user) => user.department)
  users: User[];
}
