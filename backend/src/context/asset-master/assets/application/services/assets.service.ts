import { Injectable, ConflictException } from '@nestjs/common';
import { AssetsRepository } from '../../infrastructure/database/repositories/assets.repository';
import { Asset } from '../../infrastructure/database/models/asset.entity';
import { RegisterAssetInput } from '../dto/register-asset.input';
import { AssetFilterInput } from '../dto/asset-filter.input';
import { NumberSequencesService } from '../../../../core/number-sequences/application/services/number-sequences.service';
import { AssetStatus } from '../../../../../common/enums/database.enums';

@Injectable()
export class AssetsService {
  constructor(
    private readonly assetsRepository: AssetsRepository,
    private readonly numberSequencesService: NumberSequencesService,
  ) {}

  async listAssets(filter?: AssetFilterInput): Promise<Asset[]> {
    return this.assetsRepository.listAll(filter || {});
  }

  async getAssetById(id: string): Promise<Asset | null> {
    return this.assetsRepository.findById(id);
  }

  async registerAsset(input: RegisterAssetInput): Promise<Asset> {
    // Check for unique serial number first
    const existing = await this.assetsRepository.listAll({ search: input.serial_number });
    const serialExists = existing.some(a => a.serial_number === input.serial_number);
    if (serialExists) {
      throw new ConflictException(`Asset with serial number "${input.serial_number}" already exists`);
    }

    // Generate the atomic asset tag using the prefix "AF"
    const assetTag = await this.numberSequencesService.generateTag('AF');

    // Ensure custom_fields_data is stored as a JSON string
    const customFieldsData: string =
      typeof input.custom_fields_data === 'string' && input.custom_fields_data.trim()
        ? input.custom_fields_data
        : '{}';

    const assetData: Partial<Asset> = {
      asset_tag: assetTag,
      name: input.name,
      serial_number: input.serial_number,
      category_id: input.category_id,
      acquisition_date: new Date(input.acquisition_date as unknown as string),
      acquisition_cost: input.acquisition_cost,
      condition: input.condition,
      location: input.location,
      is_shared_bookable: input.is_shared_bookable,
      status: AssetStatus.AVAILABLE,
      custom_fields_data: customFieldsData,
      photo_url: input.photo_url || null,
    };

    return this.assetsRepository.createOne(assetData);
  }
}
