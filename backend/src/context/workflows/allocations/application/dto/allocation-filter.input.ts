import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { AllocationStatus } from '../../../../../common/enums/database.enums';

@InputType()
export class AllocationFilterInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  search?: string;

  @Field(() => AllocationStatus, { nullable: true })
  @IsEnum(AllocationStatus)
  @IsOptional()
  status?: AllocationStatus;

  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  asset_id?: string;

  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  user_id?: string;
}
