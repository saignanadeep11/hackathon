import { Resolver, Query, Mutation, Args, InputType, Field, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Asset } from '../../infrastructure/database/models/asset.entity';
import { AssetsService } from '../../application/services/assets.service';
import { JwtAuthGuard } from '../../../../identity/auth/infrastructure/guards/jwt-auth.guard';

@InputType()
export class CreateAssetInput {
  @Field() asset_tag: string;
  @Field() name: string;
  @Field() serial_number: string;
  @Field() category_id: string;
  @Field() acquisition_date: string;
  @Field(() => Float) acquisition_cost: number;
  @Field() condition: string;
  @Field() location: string;
  @Field() is_shared_bookable: boolean;
}

@Resolver(() => Asset)
@UseGuards(JwtAuthGuard)
export class AssetsResolver {
  constructor(private readonly assetsService: AssetsService) {}

  @Query(() => [Asset])
  async assets() {
    return this.assetsService.findAll();
  }

  @Mutation(() => Asset)
  async createAsset(@Args('input') input: CreateAssetInput) {
    return this.assetsService.create({
      ...input,
      acquisition_date: new Date(input.acquisition_date) as any
    });
  }
}
