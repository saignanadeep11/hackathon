import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsDate } from 'class-validator';

@InputType()
export class CreateBookingInput {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  asset_id: string;

  @Field(() => Date)
  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @Field(() => Date)
  @IsDate()
  @IsNotEmpty()
  end_time: Date;
}
