import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './infrastructure/database/models/department.entity';
import { DepartmentsService } from './application/services/departments.service';
import { DepartmentsResolver } from './interface/graphql-api/departments.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  providers: [DepartmentsService, DepartmentsResolver],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
