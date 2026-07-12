import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [AuthModule, UsersModule, DepartmentsModule],
  exports: [AuthModule, UsersModule, DepartmentsModule],
})
export class IdentityModule {}
