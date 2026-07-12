import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AssetCategory } from '../../infrastructure/database/models/asset-category.entity';
import { CursorPageInfoDto } from '../../../../../common/crud/base-crud.dtos';

@ObjectType()
export class AssetCategoryEdge {
  @Field(() => String)
  cursor: string;

  @Field(() => AssetCategory)
  node: AssetCategory;
}

@ObjectType()
export class CategoriesConnection {
  @Field(() => [AssetCategoryEdge])
  edges: AssetCategoryEdge[];

  @Field(() => CursorPageInfoDto)
  pageInfo: CursorPageInfoDto;

  @Field(() => Int)
  totalCount: number;
}
