import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Field, ObjectType, Int } from '@nestjs/graphql';
import { v7 as uuidv7 } from 'uuid';

@ObjectType()
@Entity('number_sequences')
export class NumberSequence {
  @Field(() => String)
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv7();

  @Field(() => String)
  @Column({ unique: true })
  prefix: string;

  @Field(() => Int)
  @Column({ default: 0 })
  current_value: number;

  @Field(() => Int)
  @Column({ default: 4 })
  padding: number;
}
