import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortDirection, { name: 'SortDirection' });

@InputType()
export class ScalarFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  eq?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ne?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  gt?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  gte?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lt?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lte?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  in?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  nin?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  like?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ilike?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contains?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  startsWith?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  endsWith?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  icontains?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  istartsWith?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  iendsWith?: string;

  @Field({ nullable: true })
  @IsOptional()
  isNull?: boolean;
}

@InputType()
export class BooleanFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  eq?: boolean;
}

@InputType()
export class SortInput {
  @Field()
  @IsString()
  field: string;

  @Field(() => SortDirection)
  @IsIn([SortDirection.ASC, SortDirection.DESC])
  direction: SortDirection;
}

@InputType()
export class QueryArgsInput {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  first?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  after?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  last?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  before?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @Field(() => [SortInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SortInput)
  sort?: SortInput[];
}

@ObjectType()
export class CursorPageInfoDto {
  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;

  @Field(() => String, { nullable: true })
  startCursor: string | null;

  @Field(() => String, { nullable: true })
  endCursor: string | null;
}

@ObjectType()
export class OffsetPageInfoDto {
  @Field()
  limit: number;

  @Field()
  offset: number;
}
