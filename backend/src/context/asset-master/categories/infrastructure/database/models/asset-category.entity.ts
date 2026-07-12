import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { v7 as uuidv7 } from 'uuid';
import { Asset } from '../../../../assets/infrastructure/database/models/asset.entity';

@ObjectType()
@Entity('asset_categories')
export class AssetCategory {
  @Field(() => String)
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv7();

  @Field(() => String)
  @Column()
  name: string;

  // Uses JSON scalar for GraphQL (stored as text string to avoid object scalar errors)
  @Field(() => String)
  @Column({ type: 'text', default: '' })
  custom_fields_schema: string;

  @Field(() => [Asset], { nullable: true })
  @OneToMany(() => Asset, (asset) => asset.category)
  assets: Asset[];
}
