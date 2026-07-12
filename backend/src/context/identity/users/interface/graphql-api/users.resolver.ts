import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from '../../infrastructure/database/models/user.entity';
import { UsersService } from '../../application/services/users.service';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => User, { name: 'me', nullable: true })
  async getMe(@CurrentUser() user: User): Promise<User | null> {
    return this.usersService.findById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User], { name: 'users' })
  async getUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }
}

