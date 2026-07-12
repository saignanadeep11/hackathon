import { Resolver, Query, Mutation, Args, InputType, Field, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Asset } from '../../infrastructure/database/models/asset.entity';
import { AssetsService } from '../../application/services/assets.service';
import { RegisterAssetInput } from '../../application/dto/register-asset.input';
import { AssetFilterInput } from '../../application/dto/asset-filter.input';
import { JwtAuthGuard } from '../../../../identity/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../../common/guards/roles.guard';
import { Roles } from '../../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../../common/enums/database.enums';

@Resolver(() => Asset)
export class AssetsResolver {
  constructor(private readonly assetsService: AssetsService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Asset], { name: 'assets' })
  async getAssets(
    @Args('filter', { nullable: true }) filter?: AssetFilterInput,
  ): Promise<Asset[]> {
    return this.assetsService.listAssets(filter);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Asset, { name: 'asset', nullable: true })
  async getAssetById(@Args('id') id: string): Promise<Asset | null> {
    return this.assetsService.getAssetById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ASSET_MANAGER)
  @Mutation(() => Asset, { name: 'registerAsset' })
  async registerAsset(
    @Args('input') input: RegisterAssetInput,
  ): Promise<Asset> {
    return this.assetsService.registerAsset(input);
  }
}
