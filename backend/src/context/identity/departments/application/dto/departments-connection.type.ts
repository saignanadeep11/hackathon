import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Department } from '../../infrastructure/database/models/department.entity';
import { CursorPageInfoDto } from '../../../../../common/crud/base-crud.dtos';

@ObjectType()
export class DepartmentEdge {
  @Field(() => String)
  cursor: string;

  @Field(() => Department)
  node: Department;
}

@ObjectType()
export class DepartmentsConnection {
  @Field(() => [DepartmentEdge])
  edges: DepartmentEdge[];

  @Field(() => CursorPageInfoDto)
  pageInfo: CursorPageInfoDto;

  @Field(() => Int)
  totalCount: number;
}
