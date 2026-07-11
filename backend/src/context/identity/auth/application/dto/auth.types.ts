import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../../users/infrastructure/database/models/user.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
