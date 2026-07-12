import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { v7 as uuidv7 } from 'uuid';
import { AssetStatus } from '../../../../../../common/enums/database.enums';
import { AssetCategory } from '../../../../categories/infrastructure/database/models/asset-category.entity';

@ObjectType()
@Entity('assets')
export class Asset {
  @Field(() => String)
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv7();

  @Field(() => String)
  @Column({ unique: true })
  asset_tag: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column({ unique: true })
  serial_number: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  category_id: string;

  @Field(() => AssetCategory)
  @ManyToOne(() => AssetCategory, (category) => category.assets)
  @JoinColumn({ name: 'category_id' })
  category: AssetCategory;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  acquisition_date: Date;

  @Field(() => Number)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  acquisition_cost: number;

  @Field(() => String)
  @Column()
  condition: string;

  @Field(() => String)
  @Column()
  location: string;

  @Field(() => Boolean)
  @Column({ default: false })
  is_shared_bookable: boolean;

  @Field(() => AssetStatus)
  @Column({ type: 'enum', enum: AssetStatus, default: AssetStatus.AVAILABLE })
  status: AssetStatus;

  @Field(() => String)
  @Column({ type: 'text', default: '' })
  custom_fields_data: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  photo_url: string | null;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
