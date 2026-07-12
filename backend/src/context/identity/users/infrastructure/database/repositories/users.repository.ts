import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '../../../../../../common/crud/base-repository';
import { User } from '../models/user.entity';
import { UserFilterInput } from '../../../application/dto/user-filter.input';

@Injectable()
export class UsersRepository extends BaseRepository<User, User, UserFilterInput> {
  protected dtoClass = User;
  protected sortableFields = { id: 'id', email: 'email', name: 'name', createdAt: 'createdAt' };
  protected rootFilterConfig = { filterableFields: { id: 'id', email: 'email', name: 'name' } };

  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
  ) {
    super();
  }

  protected setRelationsForSelect(qb: SelectQueryBuilder<User>): void {
    qb.leftJoinAndSelect('e.department', 'department');
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } as any, relations: { department: true } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } as any, relations: { department: true } });
  }

  async findAllUsers(): Promise<User[]> {
    return this.repository.find({ relations: { department: true } });
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }
}
