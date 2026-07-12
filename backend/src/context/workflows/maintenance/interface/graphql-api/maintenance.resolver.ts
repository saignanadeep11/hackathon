import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MaintenanceRequest } from '../../infrastructure/database/models/maintenance-request.entity';
import { MaintenanceService } from '../../application/maintenance.service';
import { CreateMaintenanceRequestInput } from '../../application/dto/create-maintenance-request.input';
import { MaintenanceFilterInput } from '../../application/dto/maintenance-filter.input';

import { JwtAuthGuard } from '../../../../identity/auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../identity/auth/infrastructure/decorators/current-user.decorator';
import { User } from '../../../../identity/users/infrastructure/database/models/user.entity';

@Resolver(() => MaintenanceRequest)
export class MaintenanceResolver {
  constructor(private readonly maintenanceService: MaintenanceService) { }

  @UseGuards(JwtAuthGuard)
  @Query(() => [MaintenanceRequest], { name: 'maintenanceRequests' })
  async getMaintenanceRequests(
    @Args('filter', { type: () => MaintenanceFilterInput, nullable: true })
    filter?: MaintenanceFilterInput,
  ): Promise<MaintenanceRequest[]> {
    return await this.maintenanceService.listRequests(filter);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => MaintenanceRequest, { name: 'createMaintenanceRequest' })
  async createMaintenanceRequest(
    @Args('input', { type: () => CreateMaintenanceRequestInput })
    input: CreateMaintenanceRequestInput,
    @CurrentUser() user: User,
  ): Promise<MaintenanceRequest> {
    return await this.maintenanceService.createRequest(input, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => MaintenanceRequest, { name: 'approveMaintenanceRequest' })
  async approveMaintenanceRequest(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<MaintenanceRequest> {
    return await this.maintenanceService.approveRequest(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => MaintenanceRequest, { name: 'rejectMaintenanceRequest' })
  async rejectMaintenanceRequest(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<MaintenanceRequest> {
    return await this.maintenanceService.rejectRequest(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => MaintenanceRequest, { name: 'assignTechnician' })
  async assignTechnician(
    @Args('id') id: string,
    @Args('technician_name') technicianName: string,
    @CurrentUser() user: User,
  ): Promise<MaintenanceRequest> {
    return await this.maintenanceService.assignTechnician(
      id,
      technicianName,
      user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => MaintenanceRequest, { name: 'resolveMaintenanceRequest' })
  async resolveMaintenanceRequest(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<MaintenanceRequest> {
    return await this.maintenanceService.resolveRequest(id, user.id);
  }
}
