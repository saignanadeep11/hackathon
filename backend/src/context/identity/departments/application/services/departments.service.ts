import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../../infrastructure/database/models/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      relations: {
        head: true,
        parent_department: true,
      },
    });
  }

  async create(name: string, headId?: string, parentDepartmentId?: string): Promise<Department> {
    const department = this.departmentRepository.create({
      name,
      head_id: headId || undefined,
      parent_department_id: parentDepartmentId || undefined,
    });
    return this.departmentRepository.save(department);
  }
}
