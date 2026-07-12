import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';
import { ActivityLogType } from '../../../../../common/enums/database.enums';

@InputType()
export class ActivityLogFilterInput {
  @Field(() => ActivityLogType, { nullable: true })
  @IsOptional()
  @IsEnum(ActivityLogType)
  type?: ActivityLogType;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  is_read?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  actor_id?: string;
}
