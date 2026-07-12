import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ActivityLog } from '../../infrastructure/database/models/activity-log.entity';
import { ActivityLogService } from '../../application/services/activity-log.service';
import { ActivityLogFilterInput } from '../../application/dto/activity-log-filter.input';
import { JwtAuthGuard } from 'src/context/identity/auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from 'src/context/identity/auth/infrastructure/decorators/current-user.decorator';
import { User } from 'src/context/identity/users/infrastructure/database/models/user.entity';

@Resolver(() => ActivityLog)
export class ActivityLogResolver {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [ActivityLog], { name: 'activityLogs' })
  async getActivityLogs(
    @Args('filter', { nullable: true }) filter?: ActivityLogFilterInput,
  ): Promise<ActivityLog[]> {
    return this.activityLogService.getLogs(filter ?? {});
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Int, { name: 'unreadNotificationCount' })
  async getUnreadCount(@CurrentUser() user: User): Promise<number> {
    return this.activityLogService.getUnreadCount(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'markAllNotificationsRead' })
  async markAllRead(@CurrentUser() user: User): Promise<boolean> {
    return this.activityLogService.markAllRead(user.id);
  }
}
