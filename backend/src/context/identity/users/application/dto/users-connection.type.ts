import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../infrastructure/database/models/user.entity';
import { CursorPageInfoDto } from '../../../../../common/crud/base-crud.dtos';

@ObjectType()
export class UserEdge {
  @Field(() => String)
  cursor: string;

  @Field(() => User)
  node: User;
}

@ObjectType()
export class UsersConnection {
  @Field(() => [UserEdge])
  edges: UserEdge[];

  @Field(() => CursorPageInfoDto)
  pageInfo: CursorPageInfoDto;

  @Field(() => Int)
  totalCount: number;
}
