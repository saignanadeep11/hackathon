import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetAllocation } from '../../infrastructure/database/models/asset-allocation.entity';
import { AllocationRepository } from '../../infrastructure/database/repositories/allocation.repository';
import { Asset } from '../../../../asset-master/assets/infrastructure/database/models/asset.entity';
import { AllocationStatus, AssetStatus } from '../../../../../common/enums/database.enums';
import { CreateAllocationInput } from '../dto/create-allocation.input';

@Injectable()
export class AllocationService {
  constructor(
    private readonly allocationRepo: AllocationRepository,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async listAllocations(filters: {
    status?: string;
    asset_id?: string;
    user_id?: string;
    search?: string;
  }): Promise<AssetAllocation[]> {
    return this.allocationRepo.listAll(filters);
  }

  async getAllocationById(id: string): Promise<AssetAllocation | null> {
    return this.allocationRepo.findById(id);
  }

  async requestAllocation(input: CreateAllocationInput, requestedByUserId: string): Promise<AssetAllocation> {
    const asset = await this.assetRepository.findOne({ where: { id: input.asset_id } });
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${input.asset_id} not found`);
    }

    if (asset.status === AssetStatus.ALLOCATED) {
      throw new ConflictException(`Asset "${asset.name}" is already ALLOCATED`);
    }

    // Create the allocation request in REQUESTED state
    const allocationData: Partial<AssetAllocation> = {
      asset_id: input.asset_id,
      allocated_to_user_id: input.allocated_to_user_id || null,
      allocated_to_department_id: input.allocated_to_department_id || null,
      requested_by_id: requestedByUserId,
      expected_return_date: input.expected_return_date ? new Date(input.expected_return_date) : null,
      status: AllocationStatus.REQUESTED,
    };

    return this.allocationRepo.createOne(allocationData);
  }

  async approveAllocation(id: string): Promise<AssetAllocation> {
    const allocation = await this.allocationRepo.findById(id);
    if (!allocation) {
      throw new NotFoundException(`Allocation request ${id} not found`);
    }

    if (allocation.status !== AllocationStatus.REQUESTED) {
      throw new BadRequestException(`Allocation request is not in REQUESTED status (current: ${allocation.status})`);
    }

    const asset = await this.assetRepository.findOne({ where: { id: allocation.asset_id } });
    if (!asset) {
      throw new NotFoundException(`Asset associated with allocation not found`);
    }

    if (asset.status === AssetStatus.ALLOCATED) {
      // Reject the allocation automatically if it was already allocated in the meantime
      allocation.status = AllocationStatus.REJECTED;
      await this.allocationRepo.createOne(allocation); // saves state
      throw new ConflictException(`Asset "${asset.name}" is already ALLOCATED. Allocation request has been auto-rejected.`);
    }

    // Approve the allocation (transition to APPROVED, and set asset to ALLOCATED)
    allocation.status = AllocationStatus.APPROVED;
    const updatedAllocation = await this.allocationRepo.createOne(allocation);

    asset.status = AssetStatus.ALLOCATED;
    await this.assetRepository.save(asset);

    return updatedAllocation;
  }

  async rejectAllocation(id: string): Promise<AssetAllocation> {
    const allocation = await this.allocationRepo.findById(id);
    if (!allocation) {
      throw new NotFoundException(`Allocation request ${id} not found`);
    }

    if (allocation.status !== AllocationStatus.REQUESTED) {
      throw new BadRequestException(`Allocation request is not in REQUESTED status (current: ${allocation.status})`);
    }

    allocation.status = AllocationStatus.REJECTED;
    return this.allocationRepo.createOne(allocation);
  }

  async returnAsset(id: string, checkInNotes?: string): Promise<AssetAllocation> {
    const allocation = await this.allocationRepo.findById(id);
    if (!allocation) {
      throw new NotFoundException(`Allocation ${id} not found`);
    }

    if (allocation.status !== AllocationStatus.APPROVED && allocation.status !== AllocationStatus.ACTIVE) {
      throw new BadRequestException(`Cannot return asset for allocation in status ${allocation.status}`);
    }

    const asset = await this.assetRepository.findOne({ where: { id: allocation.asset_id } });
    if (!asset) {
      throw new NotFoundException(`Asset associated with allocation not found`);
    }

    // Update allocation
    allocation.status = AllocationStatus.RETURNED;
    allocation.return_date = new Date();
    if (checkInNotes !== undefined) {
      allocation.check_in_notes = checkInNotes;
    }
    const updatedAllocation = await this.allocationRepo.createOne(allocation);

    // Reset asset to AVAILABLE
    asset.status = AssetStatus.AVAILABLE;
    await this.assetRepository.save(asset);

    return updatedAllocation;
  }
}
