import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { MaintenancePriority } from '../../../../../common/enums/database.enums';

@InputType()
export class CreateMaintenanceRequestInput {
  @Field(() => String)
  @IsUUID()
  asset_id: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => MaintenancePriority)
  @IsEnum(MaintenancePriority)
  priority: MaintenancePriority;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  photo_url?: string;
}
