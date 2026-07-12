import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '../../../../../../common/crud/base-repository';
import { Department } from '../models/department.entity';
import { DepartmentFilterInput } from '../../../application/dto/department-filter.input';

@Injectable()
export class DepartmentsRepository extends BaseRepository<Department, Department, DepartmentFilterInput> {
  protected dtoClass = Department;
  protected sortableFields = { id: 'id', name: 'name' };
  protected rootFilterConfig = { filterableFields: { id: 'id', name: 'name' } };

  constructor(
    @InjectRepository(Department)
    protected readonly repository: Repository<Department>,
  ) {
    super();
  }

  protected setRelationsForSelect(qb: SelectQueryBuilder<Department>): void {
    qb.leftJoinAndSelect('e.head', 'head');
    qb.leftJoinAndSelect('e.parent_department', 'parent_department');
  }

  async findById(id: string): Promise<Department | null> {
    return this.repository.findOne({
      where: { id } as any,
      relations: { head: true, parent_department: true },
    });
  }

  async fetchAll(): Promise<Department[]> {
    return this.repository.find({ relations: { head: true, parent_department: true } });
  }

  async save(department: Department): Promise<Department> {
    return this.repository.save(department);
  }

  createEntity(departmentData: Partial<Department>): Department {
    return this.repository.create(departmentData);
  }
}
