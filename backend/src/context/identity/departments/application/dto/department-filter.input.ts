import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';
import { ScalarFilterInput } from '../../../../../common/crud/base-crud.dtos';

@InputType()
export class DepartmentFilterInput {
  @Field(() => [DepartmentFilterInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DepartmentFilterInput)
  and?: DepartmentFilterInput[];

  @Field(() => [DepartmentFilterInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DepartmentFilterInput)
  or?: DepartmentFilterInput[];

  @Field(() => ScalarFilterInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ScalarFilterInput)
  name?: ScalarFilterInput;
}
