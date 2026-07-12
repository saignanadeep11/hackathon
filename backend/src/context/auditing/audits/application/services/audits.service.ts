import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, EntityManager } from 'typeorm';
import { AuditCycle } from '../../infrastructure/database/models/audit-cycle.entity';
import { AuditItem } from '../../infrastructure/database/models/audit-item.entity';
import { Asset } from '../../../../asset-master/assets/infrastructure/database/models/asset.entity';
import { User } from '../../../../identity/users/infrastructure/database/models/user.entity';
import { AssetAllocation } from '../../../../workflows/allocations/infrastructure/database/models/asset-allocation.entity';
import { CreateAuditCycleInput } from '../dto/create-audit-cycle.input';
import { AuditCycleStatus, AuditItemStatus, AssetStatus, AllocationStatus } from '../../../../../common/enums/database.enums';

@Injectable()
export class AuditsService {
  constructor(
    @InjectRepository(AuditCycle)
    private readonly auditCycleRepository: Repository<AuditCycle>,
    @InjectRepository(AuditItem)
    private readonly auditItemRepository: Repository<AuditItem>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async findAllCycles(): Promise<AuditCycle[]> {
    return this.auditCycleRepository.find({
      relations: {
        target_department: true,
        items: {
          asset: true,
          auditor: true,
        },
      },
      order: {
        start_date: 'DESC',
      },
    });
  }

  async findCycleById(id: string): Promise<AuditCycle | null> {
    return this.auditCycleRepository.findOne({
      where: { id },
      relations: {
        target_department: true,
        items: {
          asset: true,
          auditor: true,
        },
      },
    });
  }

  async findItemsByAuditor(auditorId: string): Promise<AuditItem[]> {
    return this.auditItemRepository.find({
      where: { auditor_id: auditorId },
      relations: {
        audit_cycle: true,
        asset: {
          category: true,
        },
      },
    });
  }

  async createCycle(input: CreateAuditCycleInput): Promise<AuditCycle> {
    const { name, target_department_id, start_date, end_date, auditor_ids } = input;

    if (auditor_ids.length === 0) {
      throw new BadRequestException('At least one auditor must be assigned to the cycle.');
    }

    // Verify auditors exist
    const auditors = await this.userRepository.find({
      where: { id: In(auditor_ids) },
    });
    if (auditors.length !== auditor_ids.length) {
      throw new NotFoundException('One or more specified auditors were not found.');
    }

    // Determine eligible assets
    let eligibleAssets: Asset[] = [];
    if (target_department_id) {
      const departmentUsers = await this.userRepository.find({
        where: { department_id: target_department_id },
      });
      const departmentUserIds = departmentUsers.map((u) => u.id);

      const activeAllocations = await this.entityManager.getRepository(AssetAllocation).find({
        where: [
          {
            allocated_to_department_id: target_department_id,
            status: AllocationStatus.ACTIVE,
          },
          ...(departmentUserIds.length > 0
            ? [
                {
                  allocated_to_user_id: In(departmentUserIds),
                  status: AllocationStatus.ACTIVE,
                },
              ]
            : []),
        ] as any,
      });

      const assetIds = activeAllocations.map((a) => a.asset_id);
      if (assetIds.length > 0) {
        eligibleAssets = await this.assetRepository.find({
          where: {
            id: In(assetIds),
            status: Not(In([AssetStatus.RETIRED, AssetStatus.DISPOSED])),
          },
        });
      }
    } else {
      eligibleAssets = await this.assetRepository.find({
        where: {
          status: Not(In([AssetStatus.RETIRED, AssetStatus.DISPOSED])),
        },
      });
    }

    if (eligibleAssets.length === 0) {
      throw new BadRequestException('No eligible assets found for the specified department/criteria.');
    }

    // Create the Cycle
    const cycle = this.auditCycleRepository.create({
      name,
      target_department_id: target_department_id || undefined,
      start_date,
      end_date,
      status: AuditCycleStatus.OPEN,
    });

    const savedCycle = await this.auditCycleRepository.save(cycle);

    // Create Audit Items and distribute among auditors round-robin
    const items = eligibleAssets.map((asset, index) => {
      const auditorId = auditor_ids[index % auditor_ids.length];
      return this.auditItemRepository.create({
        audit_cycle_id: savedCycle.id,
        asset_id: asset.id,
        auditor_id: auditorId,
        verification_status: AuditItemStatus.VERIFIED, // default/initial status, can be updated
        notes: '',
      });
    });

    await this.auditItemRepository.save(items);

    return this.findCycleById(savedCycle.id) as Promise<AuditCycle>;
  }

  async updateItemStatus(itemId: string, status: AuditItemStatus, notes?: string): Promise<AuditItem> {
    const item = await this.auditItemRepository.findOne({
      where: { id: itemId },
      relations: { audit_cycle: true, asset: true },
    });

    if (!item) {
      throw new NotFoundException(`AuditItem with ID "${itemId}" not found.`);
    }

    if (item.audit_cycle.status === AuditCycleStatus.CLOSED) {
      throw new BadRequestException('Cannot update items of a closed audit cycle.');
    }

    item.verification_status = status;
    if (notes !== undefined) {
      item.notes = notes;
    }

    const savedItem = await this.auditItemRepository.save(item);

    // If status is MISSING, update asset status to LOST
    if (status === AuditItemStatus.MISSING) {
      await this.assetRepository.update(item.asset_id, {
        status: AssetStatus.LOST,
      });
    } else if (status === AuditItemStatus.DAMAGED) {
      // If status is DAMAGED, update asset condition
      await this.assetRepository.update(item.asset_id, {
        condition: 'Damaged',
      });
    }

    return savedItem;
  }

  async closeCycle(id: string): Promise<AuditCycle> {
    const cycle = await this.auditCycleRepository.findOne({
      where: { id },
    });

    if (!cycle) {
      throw new NotFoundException(`AuditCycle with ID "${id}" not found.`);
    }

    cycle.status = AuditCycleStatus.CLOSED;
    await this.auditCycleRepository.save(cycle);

    return this.findCycleById(id) as Promise<AuditCycle>;
  }
}
