import { Injectable, NotFoundException } from '@nestjs/common';
import { Department } from '../../infrastructure/database/models/department.entity';
import { GeneralStatus } from '../../../../../common/enums/database.enums';
import { DepartmentsRepository } from '../../infrastructure/database/repositories/departments.repository';
import { QueryArgs } from '../../../../../common/crud/base-crud.types';
import { ConnectionResult } from '../../../../../common/crud/base-repository';
import { DepartmentFilterInput } from '../dto/department-filter.input';

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly departmentsRepository: DepartmentsRepository,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentsRepository.fetchAll();
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentsRepository.findById(id);
    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
    return department;
  }

  async create(name: string, head_id?: string, parent_department_id?: string): Promise<Department> {
    const department = this.departmentsRepository.createEntity({
      name,
      head_id,
      parent_department_id,
      status: GeneralStatus.ACTIVE,
    });
    return this.departmentsRepository.save(department);
  }

  async updateStatus(id: string, status: GeneralStatus): Promise<Department> {
    const department = await this.findOne(id);
    department.status = status;
    return this.departmentsRepository.save(department);
  }

  async updateHead(id: string, head_id: string): Promise<Department> {
    const department = await this.findOne(id);
    department.head_id = head_id;
    return this.departmentsRepository.save(department);
  }

  async update(
    id: string,
    name?: string,
    head_id?: string,
    parent_department_id?: string,
  ): Promise<Department> {
    const department = await this.findOne(id);
    if (name !== undefined) department.name = name;
    // Allow clearing head_id or parent_department_id
    if (head_id !== undefined) department.head_id = (head_id || null) as any;
    if (parent_department_id !== undefined) {
      department.parent_department_id = (parent_department_id || null) as any;
    }
    return this.departmentsRepository.save(department);
  }

  async listDepartmentsPage(args: QueryArgs<DepartmentFilterInput>): Promise<ConnectionResult<Department>> {
    return this.departmentsRepository.findAll(args);
  }
}
