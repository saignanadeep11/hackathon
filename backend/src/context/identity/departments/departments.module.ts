import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './infrastructure/database/models/department.entity';
import { DepartmentsService } from './application/services/departments.service';
import { DepartmentsResolver } from './interface/graphql-api/departments.resolver';
import { DepartmentsRepository } from './infrastructure/database/repositories/departments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  providers: [DepartmentsService, DepartmentsResolver, DepartmentsRepository],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
