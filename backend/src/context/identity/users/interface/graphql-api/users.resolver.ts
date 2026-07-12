import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
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
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User], { name: 'users' })
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async promoteToAdmin(@Args('id', { type: () => String }) id: string): Promise<User> {
    // Note: We use dynamic role import or pass enum directly, assuming UserRole.ADMIN is available,
    // but to avoid import issues, we can just pass 'ADMIN' as any
    return this.usersService.updateRole(id, 'ADMIN' as any);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async promoteToDeptHead(@Args('id', { type: () => String }) id: string): Promise<User> {
    return this.usersService.updateRole(id, 'DEPARTMENT_HEAD' as any);
  }
}
