import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';
import { ScalarFilterInput } from '../../../../../common/crud/base-crud.dtos';

@InputType()
export class UserFilterInput {
  @Field(() => [UserFilterInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UserFilterInput)
  and?: UserFilterInput[];

  @Field(() => [UserFilterInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UserFilterInput)
  or?: UserFilterInput[];

  @Field(() => ScalarFilterInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ScalarFilterInput)
  name?: ScalarFilterInput;

  @Field(() => ScalarFilterInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => ScalarFilterInput)
  email?: ScalarFilterInput;
}
