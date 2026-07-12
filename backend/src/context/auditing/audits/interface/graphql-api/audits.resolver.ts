import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../identity/auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../identity/auth/infrastructure/decorators/current-user.decorator';
import { User } from '../../../../identity/users/infrastructure/database/models/user.entity';
import { AuditCycle } from '../../infrastructure/database/models/audit-cycle.entity';
import { AuditItem } from '../../infrastructure/database/models/audit-item.entity';
import { AuditsService } from '../../application/services/audits.service';
import { CreateAuditCycleInput } from '../../application/dto/create-audit-cycle.input';
import { AuditItemStatus } from '../../../../../common/enums/database.enums';

@Resolver(() => AuditCycle)
export class AuditsResolver {
  constructor(private readonly auditsService: AuditsService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [AuditCycle], { name: 'auditCycles' })
  async getAuditCycles(): Promise<AuditCycle[]> {
    return this.auditsService.findAllCycles();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => AuditCycle, { name: 'auditCycle', nullable: true })
  async getAuditCycleById(@Args('id') id: string): Promise<AuditCycle | null> {
    return this.auditsService.findCycleById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [AuditItem], { name: 'myAuditItems' })
  async getMyAuditItems(@CurrentUser() user: User): Promise<AuditItem[]> {
    return this.auditsService.findItemsByAuditor(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => AuditCycle, { name: 'createAuditCycle' })
  async createAuditCycle(@Args('input') input: CreateAuditCycleInput): Promise<AuditCycle> {
    return this.auditsService.createCycle(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => AuditItem, { name: 'updateAuditItemStatus' })
  async updateAuditItemStatus(
    @Args('itemId') itemId: string,
    @Args('status', { type: () => AuditItemStatus }) status: AuditItemStatus,
    @Args('notes', { nullable: true }) notes?: string,
  ): Promise<AuditItem> {
    return this.auditsService.updateItemStatus(itemId, status, notes);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => AuditCycle, { name: 'closeAuditCycle' })
  async closeAuditCycle(@Args('id') id: string): Promise<AuditCycle> {
    return this.auditsService.closeCycle(id);
  }
}
