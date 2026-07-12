import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AssetAllocation } from '../../infrastructure/database/models/asset-allocation.entity';
import { AllocationService } from '../../application/services/allocation.service';
import { CreateAllocationInput } from '../../application/dto/create-allocation.input';
import { AllocationFilterInput } from '../../application/dto/allocation-filter.input';
import { JwtAuthGuard } from '../../../../identity/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../../common/guards/roles.guard';
import { Roles } from '../../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../../common/enums/database.enums';
import { CurrentUser } from '../../../../identity/auth/infrastructure/decorators/current-user.decorator';
import { User } from '../../../../identity/users/infrastructure/database/models/user.entity';

@Resolver(() => AssetAllocation)
export class AllocationResolver {
  constructor(private readonly allocationService: AllocationService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [AssetAllocation], { name: 'allocations' })
  async getAllocations(
    @Args('filter', { nullable: true }) filter?: AllocationFilterInput,
  ): Promise<AssetAllocation[]> {
    return this.allocationService.listAllocations(filter || {});
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => AssetAllocation, { name: 'allocation', nullable: true })
  async getAllocationById(@Args('id') id: string): Promise<AssetAllocation | null> {
    return this.allocationService.getAllocationById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => AssetAllocation, { name: 'requestAllocation' })
  async requestAllocation(
    @Args('input') input: CreateAllocationInput,
    @CurrentUser() user: User,
  ): Promise<AssetAllocation> {
    return this.allocationService.requestAllocation(input, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ASSET_MANAGER, UserRole.DEPARTMENT_HEAD)
  @Mutation(() => AssetAllocation, { name: 'approveAllocation' })
  async approveAllocation(@Args('id') id: string): Promise<AssetAllocation> {
    return this.allocationService.approveAllocation(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ASSET_MANAGER, UserRole.DEPARTMENT_HEAD)
  @Mutation(() => AssetAllocation, { name: 'rejectAllocation' })
  async rejectAllocation(@Args('id') id: string): Promise<AssetAllocation> {
    return this.allocationService.rejectAllocation(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => AssetAllocation, { name: 'returnAsset' })
  async returnAsset(
    @Args('id') id: string,
    @Args('check_in_notes', { nullable: true }) checkInNotes?: string,
  ): Promise<AssetAllocation> {
    return this.allocationService.returnAsset(id, checkInNotes);
  }
}
