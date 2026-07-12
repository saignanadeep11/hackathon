import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';
import { ScalarFilterInput } from '../../../../../common/crud/base-crud.dtos';

@InputType()
export class CategoryFilterInput {
  @Field(() => [CategoryFilterInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CategoryFilterInput)
  and?: CategoryFilterInput[];

  @Field(() => [CategoryFilterInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CategoryFilterInput)
  or?: CategoryFilterInput[];

  @Field(() => ScalarFilterInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ScalarFilterInput)
  name?: ScalarFilterInput;
}
