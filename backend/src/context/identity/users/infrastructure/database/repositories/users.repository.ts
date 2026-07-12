import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../../../../common/crud/base-repository';
import { User } from '../models/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository<User, any, any> {
  protected dtoClass = class {} as any;
  protected sortableFields = { id: 'id', email: 'email' };
  protected rootFilterConfig = { filterableFields: { id: 'id', email: 'email' } };

  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
  ) {
    super();
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } as any });
  }

  async findAllUsers(): Promise<User[]> {
    return this.repository.find({ relations: { department: true } });
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }
}
