import {
  Resolver,
  Query,
  Mutation,
  Args,
  registerEnumType,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Department } from '../../infrastructure/database/models/department.entity';
import { DepartmentsService } from '../../application/services/departments.service';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { GeneralStatus } from '../../../../../common/enums/database.enums';

// Register Enum just in case it isn't globally registered
registerEnumType(GeneralStatus, { name: 'GeneralStatus' });

@Resolver(() => Department)
@UseGuards(JwtAuthGuard)
export class DepartmentsResolver {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Query(() => [Department], { name: 'departments' })
  async getDepartments(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @Query(() => Department, { name: 'department' })
  async getDepartment(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Department> {
    return this.departmentsService.findOne(id);
  }

  @Mutation(() => Department)
  async createDepartment(
    @Args('name', { type: () => String }) name: string,
    @Args('head_id', { type: () => String, nullable: true }) head_id?: string,
    @Args('parent_department_id', { type: () => String, nullable: true })
    parent_department_id?: string,
  ): Promise<Department> {
    return this.departmentsService.create(name, head_id, parent_department_id);
  }

  @Mutation(() => Department)
  async updateDepartmentStatus(
    @Args('id', { type: () => String }) id: string,
    @Args('status', { type: () => GeneralStatus }) status: GeneralStatus,
  ): Promise<Department> {
    return this.departmentsService.updateStatus(id, status);
  }

  @Mutation(() => Department)
  async assignDepartmentHead(
    @Args('id', { type: () => String }) id: string,
    @Args('head_id', { type: () => String }) head_id: string,
  ): Promise<Department> {
    return this.departmentsService.updateHead(id, head_id);
  }
}
