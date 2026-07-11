import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './application/services/users.service';
import { UsersResolver } from './interface/graphql-api/users.resolver';
import { UsersRepository } from './infrastructure/database/repositories/users.repository';
import { User } from './infrastructure/database/models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
