import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from '../../infrastructure/database/models/user.entity';
import { UsersService } from '../../application/services/users.service';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { UserRole } from '../../../../../common/enums/database.enums';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => User, { name: 'me', nullable: true })
  getMe(@CurrentUser() user: User): User | null {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User], { name: 'users' })
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async promoteToAdmin(
    @Args('id', { type: () => String }) id: string,
  ): Promise<User> {
    return this.usersService.updateRole(id, UserRole.ADMIN);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async promoteToDeptHead(
    @Args('id', { type: () => String }) id: string,
  ): Promise<User> {
    return this.usersService.updateRole(id, UserRole.DEPARTMENT_HEAD);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async promoteToAssetManager(
    @Args('id', { type: () => String }) id: string,
  ): Promise<User> {
    return this.usersService.updateRole(id, UserRole.ASSET_MANAGER);
  }
}
