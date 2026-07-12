import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { Department } from '../../infrastructure/database/models/department.entity';
import { DepartmentsService } from '../../application/services/departments.service';

@Resolver(() => Department)
export class DepartmentsResolver {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Department], { name: 'departments' })
  async getDepartments(): Promise<Department[]> {
    return this.departmentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Department, { name: 'createDepartment' })
  async createDepartment(
    @Args('name') name: string,
    @Args('headId', { nullable: true }) headId?: string,
    @Args('parentDepartmentId', { nullable: true }) parentDepartmentId?: string,
  ): Promise<Department> {
    return this.departmentsService.create(name, headId, parentDepartmentId);
  }
}
