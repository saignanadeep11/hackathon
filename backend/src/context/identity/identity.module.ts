import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { CoreModule } from '../core/core.module';
import { AssetMasterModule } from '../asset-master/asset-master.module';
import { AuditsModule } from '../auditing/audits/audits.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DepartmentsModule,
    AssetMasterModule,
    CoreModule,
    AuditsModule,
  ],
  exports: [
    AuthModule,
    UsersModule,
    DepartmentsModule,
    AssetMasterModule,
    CoreModule,
    AuditsModule,
  ],
})
export class IdentityModule {}
