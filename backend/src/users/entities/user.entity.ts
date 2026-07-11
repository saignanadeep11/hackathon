import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id: string = uuidv7();

  @Field()
  @Column({ unique: true })
  email: string;

  // We explicitly do NOT expose the password field to GraphQL
  @Column()
  password: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
