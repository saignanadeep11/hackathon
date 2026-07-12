import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, IsDate, IsNumber, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class RegisterAssetInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  serial_number: string;

  @Field(() => String)
  @IsUUID()
  category_id: string;

  @Field(() => Date)
  @IsDate()
  acquisition_date: Date;

  @Field(() => Float)
  @IsNumber()
  acquisition_cost: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  condition: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  location: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  is_shared_bookable: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  photo_url?: string;

  @Field(() => String, { defaultValue: '{}' })
  @IsString()
  custom_fields_data: string;
}
