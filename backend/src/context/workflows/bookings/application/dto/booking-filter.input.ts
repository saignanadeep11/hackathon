import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { BookingStatus } from '../../../../../common/enums/database.enums';

@InputType()
export class BookingFilterInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  search?: string;

  @Field(() => BookingStatus, { nullable: true })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  asset_id?: string;

  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  user_id?: string;
}
