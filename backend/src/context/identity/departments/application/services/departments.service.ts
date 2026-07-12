import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../../infrastructure/database/models/department.entity';
import { GeneralStatus } from '../../../../../common/enums/database.enums';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      relations: { head: true, parent_department: true },
    });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: { head: true, parent_department: true },
    });
    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
    return department;
  }

  async create(
    name: string,
    head_id?: string,
    parent_department_id?: string,
  ): Promise<Department> {
    const department = this.departmentRepository.create({
      name,
      head_id,
      parent_department_id,
      status: GeneralStatus.ACTIVE,
    });
    return this.departmentRepository.save(department);
  }

  async updateStatus(id: string, status: GeneralStatus): Promise<Department> {
    const department = await this.findOne(id);
    department.status = status;
    return this.departmentRepository.save(department);
  }

  async updateHead(id: string, head_id: string): Promise<Department> {
    const department = await this.findOne(id);
    department.head_id = head_id;
    return this.departmentRepository.save(department);
  }
}
