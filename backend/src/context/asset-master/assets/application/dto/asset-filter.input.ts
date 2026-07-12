import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum, IsUUID, IsBoolean } from 'class-validator';
import { AssetStatus } from '../../../../../common/enums/database.enums';

@InputType()
export class AssetFilterInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  search?: string;

  @Field(() => AssetStatus, { nullable: true })
  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;

  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  category_id?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  location?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  is_shared_bookable?: boolean;
}
