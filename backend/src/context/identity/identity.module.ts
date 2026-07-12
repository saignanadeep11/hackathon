import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { CoreModule } from '../core/core.module';
import { AssetMasterModule } from '../asset-master/asset-master.module';

@Module({
  imports: [AuthModule, UsersModule, DepartmentsModule,AssetMasterModule,
    CoreModule,],
  exports: [AuthModule, UsersModule, DepartmentsModule,AssetMasterModule,
    CoreModule,],
})
export class IdentityModule {}
