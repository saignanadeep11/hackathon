import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceRepository } from '../infrastructure/database/repositories/maintenance.repository';
import { MaintenanceRequest } from '../infrastructure/database/models/maintenance-request.entity';
import { CreateMaintenanceRequestInput } from './dto/create-maintenance-request.input';
import { MaintenanceFilterInput } from './dto/maintenance-filter.input';
import { Asset } from '../../../asset-master/assets/infrastructure/database/models/asset.entity';
import { ActivityLog } from '../../../auditing/activity-logs/infrastructure/database/models/activity-log.entity';
import {
  MaintenanceStatus,
  AssetStatus,
  ActivityLogType,
} from '../../../../common/enums/database.enums';

@Injectable()
export class MaintenanceService {
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async listRequests(
    filters?: MaintenanceFilterInput,
  ): Promise<MaintenanceRequest[]> {
    return this.maintenanceRepository.listAll(filters || {});
  }

  async getRequestById(id: string): Promise<MaintenanceRequest | null> {
    return this.maintenanceRepository.findById(id);
  }

  async createRequest(
    input: CreateMaintenanceRequestInput,
    raisedByUserId: string,
  ): Promise<MaintenanceRequest> {
    const asset = await this.assetRepository.findOne({
      where: { id: input.asset_id },
    });
    if (!asset) {
      throw new NotFoundException(
        `Asset with ID "${input.asset_id}" not found`,
      );
    }

    const request = await this.maintenanceRepository.createOne({
      asset_id: input.asset_id,
      raised_by_user_id: raisedByUserId,
      description: input.description,
      priority: input.priority,
      photo_url: input.photo_url || undefined,
      status: MaintenanceStatus.PENDING,
    });

    // Create activity log
    await this.activityLogRepository.save(
      this.activityLogRepository.create({
        type: ActivityLogType.MAINTENANCE,
        message: `Maintenance request raised for asset "${asset.name}" (${asset.asset_tag}) with priority ${input.priority}.`,
        actor_id: raisedByUserId,
        entity_id: request.id,
      }),
    );

    return this.maintenanceRepository.findById(
      request.id,
    ) as Promise<MaintenanceRequest>;
  }

  async approveRequest(
    id: string,
    actorId: string,
  ): Promise<MaintenanceRequest> {
    const request = await this.maintenanceRepository.findById(id);
    if (!request) {
      throw new NotFoundException(
        `Maintenance request with ID "${id}" not found`,
      );
    }
    if (request.status !== MaintenanceStatus.PENDING) {
      throw new BadRequestException(
        `Cannot approve request in status ${request.status}`,
      );
    }

    request.status = MaintenanceStatus.APPROVED;
    await this.maintenanceRepository.updateOne(id, {
      status: MaintenanceStatus.APPROVED,
    });

    // Update Asset Status
    await this.assetRepository.update(request.asset_id, {
      status: AssetStatus.UNDER_MAINTENANCE,
    });

    // Create activity log
    await this.activityLogRepository.save(
      this.activityLogRepository.create({
        type: ActivityLogType.MAINTENANCE,
        message: `Maintenance request for asset "${request.asset.name}" approved. Asset status set to UNDER_MAINTENANCE.`,
        actor_id: actorId,
        entity_id: request.id,
      }),
    );

    return this.maintenanceRepository.findById(
      id,
    ) as Promise<MaintenanceRequest>;
  }

  async rejectRequest(
    id: string,
    actorId: string,
  ): Promise<MaintenanceRequest> {
    const request = await this.maintenanceRepository.findById(id);
    if (!request) {
      throw new NotFoundException(
        `Maintenance request with ID "${id}" not found`,
      );
    }
    if (request.status !== MaintenanceStatus.PENDING) {
      throw new BadRequestException(
        `Cannot reject request in status ${request.status}`,
      );
    }

    request.status = MaintenanceStatus.REJECTED;
    await this.maintenanceRepository.updateOne(id, {
      status: MaintenanceStatus.REJECTED,
    });

    // Create activity log
    await this.activityLogRepository.save(
      this.activityLogRepository.create({
        type: ActivityLogType.MAINTENANCE,
        message: `Maintenance request for asset "${request.asset.name}" rejected.`,
        actor_id: actorId,
        entity_id: request.id,
      }),
    );

    return this.maintenanceRepository.findById(
      id,
    ) as Promise<MaintenanceRequest>;
  }

  async assignTechnician(
    id: string,
    technicianName: string,
    actorId: string,
  ): Promise<MaintenanceRequest> {
    const request = await this.maintenanceRepository.findById(id);
    if (!request) {
      throw new NotFoundException(
        `Maintenance request with ID "${id}" not found`,
      );
    }
    if (
      request.status !== MaintenanceStatus.APPROVED &&
      request.status !== MaintenanceStatus.IN_PROGRESS
    ) {
      throw new BadRequestException(
        `Cannot assign technician to request in status ${request.status}`,
      );
    }

    request.technician_name = technicianName;
    request.status = MaintenanceStatus.IN_PROGRESS;

    await this.maintenanceRepository.updateOne(id, {
      technician_name: technicianName,
      status: MaintenanceStatus.IN_PROGRESS,
    });

    // Create activity log
    await this.activityLogRepository.save(
      this.activityLogRepository.create({
        type: ActivityLogType.MAINTENANCE,
        message: `Technician "${technicianName}" assigned to maintenance request for "${request.asset.name}".`,
        actor_id: actorId,
        entity_id: request.id,
      }),
    );

    return this.maintenanceRepository.findById(
      id,
    ) as Promise<MaintenanceRequest>;
  }

  async resolveRequest(
    id: string,
    actorId: string,
  ): Promise<MaintenanceRequest> {
    const request = await this.maintenanceRepository.findById(id);
    if (!request) {
      throw new NotFoundException(
        `Maintenance request with ID "${id}" not found`,
      );
    }
    if (
      request.status !== MaintenanceStatus.IN_PROGRESS &&
      request.status !== MaintenanceStatus.APPROVED
    ) {
      throw new BadRequestException(
        `Cannot resolve request in status ${request.status}`,
      );
    }

    request.status = MaintenanceStatus.RESOLVED;
    await this.maintenanceRepository.updateOne(id, {
      status: MaintenanceStatus.RESOLVED,
    });

    // Reset Asset Status back to AVAILABLE
    await this.assetRepository.update(request.asset_id, {
      status: AssetStatus.AVAILABLE,
    });

    // Create activity log
    await this.activityLogRepository.save(
      this.activityLogRepository.create({
        type: ActivityLogType.MAINTENANCE,
        message: `Maintenance request for asset "${request.asset.name}" resolved. Asset status set to AVAILABLE.`,
        actor_id: actorId,
        entity_id: request.id,
      }),
    );

    return this.maintenanceRepository.findById(
      id,
    ) as Promise<MaintenanceRequest>;
  }
}
