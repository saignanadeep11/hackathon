import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsDate, IsOptional } from 'class-validator';

@InputType()
export class CreateAllocationInput {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  asset_id: string;

  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  allocated_to_user_id?: string;

  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  allocated_to_department_id?: string;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  expected_return_date?: Date;
}
