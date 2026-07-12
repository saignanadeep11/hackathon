import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../../infrastructure/database/models/asset.entity';
import { AssetStatus } from '../../../../../common/enums/database.enums';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async findAll(): Promise<Asset[]> {
    return this.assetRepository.find({ relations: { category: true } });
  }

  async create(data: Partial<Asset>): Promise<Asset> {
    const asset = this.assetRepository.create({
      ...data,
      status: AssetStatus.AVAILABLE,
    });
    return this.assetRepository.save(asset);
  }
}
