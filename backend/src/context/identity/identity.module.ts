import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoreModule } from '../core/core.module';
import { AssetMasterModule } from '../asset-master/asset-master.module';
import { AuditsModule } from '../auditing/audits/audits.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [AuthModule, UsersModule, AssetMasterModule, CoreModule, AuditsModule, DepartmentsModule],
  exports: [AuthModule, UsersModule, AssetMasterModule, CoreModule, AuditsModule, DepartmentsModule],
})
export class IdentityModule {}


