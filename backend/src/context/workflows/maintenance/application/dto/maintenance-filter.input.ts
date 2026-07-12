import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { MaintenanceStatus, MaintenancePriority } from '../../../../../common/enums/database.enums';

@InputType()
export class MaintenanceFilterInput {
  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  asset_id?: string;

  @Field(() => MaintenanceStatus, { nullable: true })
  @IsEnum(MaintenanceStatus)
  @IsOptional()
  status?: MaintenanceStatus;

  @Field(() => MaintenancePriority, { nullable: true })
  @IsEnum(MaintenancePriority)
  @IsOptional()
  priority?: MaintenancePriority;
}
