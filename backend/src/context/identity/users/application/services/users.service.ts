import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/database/repositories/users.repository';
import { User } from '../../infrastructure/database/models/user.entity';
import { QueryArgs } from '../../../../../common/crud/base-crud.types';
import { ConnectionResult } from '../../../../../common/crud/base-repository';
import { UserFilterInput } from '../dto/user-filter.input';
import { GeneralStatus, UserRole } from '../../../../../common/enums/database.enums';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async create(user: Partial<User>): Promise<User> {
    return this.usersRepository.createOne(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.fetchAllUsers();
  }

  async listUsersPage(args: QueryArgs<UserFilterInput>): Promise<ConnectionResult<User>> {
    return this.usersRepository.findAll(args);
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new Error('User not found');
    user.role = role;
    return this.usersRepository.save(user);
  }

  async updateUser(
    id: string,
    role?: UserRole,
    status?: GeneralStatus,
    department_id?: string,
  ): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new Error('User not found');
    if (role !== undefined) user.role = role;
    if (status !== undefined) user.status = status;
    if (department_id !== undefined) {
      user.department_id = (department_id || null) as any;
    }
    return this.usersRepository.save(user);
  }
}
