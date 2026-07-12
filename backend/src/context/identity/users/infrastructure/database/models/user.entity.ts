import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { GeneralStatus, UserRole } from '../../../../../../common/enums/database.enums';
import { Department } from '../../../../departments/infrastructure/database/models/department.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id: string = uuidv7();

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  // We explicitly do NOT expose the password field to GraphQL
  @Column()
  password_hash: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @Field(() => GeneralStatus)
  @Column({ type: 'enum', enum: GeneralStatus, default: GeneralStatus.ACTIVE })
  status: GeneralStatus;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  department_id: string;

  @Field(() => Department, { nullable: true })
  @ManyToOne(() => Department, dept => dept.users)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
