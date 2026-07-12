import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from '../../infrastructure/database/models/user.entity';
import { UsersService } from '../../application/services/users.service';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { UsersConnection } from '../../application/dto/users-connection.type';
import { UserFilterInput } from '../../application/dto/user-filter.input';
import { RolesGuard } from '../../../../../common/guards/roles.guard';
import { Roles } from '../../../../../common/decorators/roles.decorator';
import { GeneralStatus, UserRole } from '../../../../../common/enums/database.enums';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => User, { name: 'me', nullable: true })
  async getMe(@CurrentUser() user: User): Promise<User | null> {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User], { name: 'users' })
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UsersConnection, { name: 'usersPage' })
  async getUsersPage(
    @Args('filter', { nullable: true }) filter?: UserFilterInput,
    @Args('first', { nullable: true, type: () => Number }) first?: number,
    @Args('after', { nullable: true }) after?: string,
    @Args('last', { nullable: true, type: () => Number }) last?: number,
    @Args('before', { nullable: true }) before?: string,
  ): Promise<UsersConnection> {
    return this.usersService.listUsersPage({
      filter,
      first,
      after,
      last,
      before,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => User)
  async promoteToAdmin(@Args('id', { type: () => String }) id: string): Promise<User> {
    return this.usersService.updateRole(id, UserRole.ADMIN);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => User)
  async promoteToDeptHead(@Args('id', { type: () => String }) id: string): Promise<User> {
    return this.usersService.updateRole(id, UserRole.DEPARTMENT_HEAD);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => String }) id: string,
    @Args('role', { type: () => UserRole, nullable: true }) role?: UserRole,
    @Args('status', { type: () => GeneralStatus, nullable: true }) status?: GeneralStatus,
    @Args('department_id', { type: () => String, nullable: true }) department_id?: string,
  ): Promise<User> {
    return this.usersService.updateUser(id, role, status, department_id);
  }
}
