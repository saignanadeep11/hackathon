import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/database/repositories/users.repository';
import { User } from '../../infrastructure/database/models/user.entity';

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
}
