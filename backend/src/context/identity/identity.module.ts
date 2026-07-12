import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoreModule } from '../core/core.module';
import { AssetMasterModule } from '../asset-master/asset-master.module';

@Module({
  imports: [AuthModule, UsersModule,AssetMasterModule,
    CoreModule,],
  exports: [AuthModule, UsersModule,AssetMasterModule,
    CoreModule,],
})
export class IdentityModule {}
