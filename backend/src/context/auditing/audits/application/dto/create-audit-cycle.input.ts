import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsArray, IsDate } from 'class-validator';

@InputType()
export class CreateAuditCycleInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  target_department_id?: string;

  @Field(() => Date)
  @IsNotEmpty()
  @IsDate()
  start_date: Date;

  @Field(() => Date)
  @IsNotEmpty()
  @IsDate()
  end_date: Date;

  @Field(() => [String])
  @IsNotEmpty()
  @IsArray()
  auditor_ids: string[];
}
