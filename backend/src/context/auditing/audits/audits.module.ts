import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditCycle } from './infrastructure/database/models/audit-cycle.entity';
import { AuditItem } from './infrastructure/database/models/audit-item.entity';
import { Asset } from '../../asset-master/assets/infrastructure/database/models/asset.entity';
import { User } from '../../identity/users/infrastructure/database/models/user.entity';
import { AuditsService } from './application/services/audits.service';
import { AuditsResolver } from './interface/graphql-api/audits.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditCycle, AuditItem, Asset, User]),
  ],
  providers: [AuditsService, AuditsResolver],
  exports: [AuditsService],
})
export class AuditsModule {}
