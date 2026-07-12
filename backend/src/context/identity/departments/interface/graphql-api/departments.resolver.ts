import { Resolver, Query, Mutation, Args, registerEnumType } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Department } from '../../infrastructure/database/models/department.entity';
import { DepartmentsService } from '../../application/services/departments.service';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { GeneralStatus } from '../../../../../common/enums/database.enums';
import { DepartmentsConnection } from '../../application/dto/departments-connection.type';
import { DepartmentFilterInput } from '../../application/dto/department-filter.input';
import { Roles } from '../../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../../common/enums/database.enums';

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

  @Query(() => DepartmentsConnection, { name: 'departmentsPage' })
  async getDepartmentsPage(
    @Args('filter', { nullable: true }) filter?: DepartmentFilterInput,
    @Args('first', { nullable: true, type: () => Number }) first?: number,
    @Args('after', { nullable: true }) after?: string,
    @Args('last', { nullable: true, type: () => Number }) last?: number,
    @Args('before', { nullable: true }) before?: string,
  ): Promise<DepartmentsConnection> {
    return this.departmentsService.listDepartmentsPage({
      filter,
      first,
      after,
      last,
      before,
    });
  }

  @Query(() => Department, { name: 'department' })
  async getDepartment(@Args('id', { type: () => String }) id: string): Promise<Department> {
    return this.departmentsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => Department)
  async createDepartment(
    @Args('name', { type: () => String }) name: string,
    @Args('head_id', { type: () => String, nullable: true }) head_id?: string,
    @Args('parent_department_id', { type: () => String, nullable: true }) parent_department_id?: string,
  ): Promise<Department> {
    return this.departmentsService.create(name, head_id, parent_department_id);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => Department)
  async updateDepartmentStatus(
    @Args('id', { type: () => String }) id: string,
    @Args('status', { type: () => GeneralStatus }) status: GeneralStatus,
  ): Promise<Department> {
    return this.departmentsService.updateStatus(id, status);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => Department)
  async assignDepartmentHead(
    @Args('id', { type: () => String }) id: string,
    @Args('head_id', { type: () => String }) head_id: string,
  ): Promise<Department> {
    return this.departmentsService.updateHead(id, head_id);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => Department)
  async updateDepartment(
    @Args('id', { type: () => String }) id: string,
    @Args('name', { type: () => String, nullable: true }) name?: string,
    @Args('head_id', { type: () => String, nullable: true }) head_id?: string,
    @Args('parent_department_id', { type: () => String, nullable: true }) parent_department_id?: string,
  ): Promise<Department> {
    return this.departmentsService.update(id, name, head_id, parent_department_id);
  }
}
