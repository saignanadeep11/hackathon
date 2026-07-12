import { MigrationInterface, QueryRunner } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

export class SeedAssetNumberSequence1783838383839 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const seq = {
      id: uuidv7(),
      prefix: 'AF',
      current_value: 0,
      padding: 4,
    };
    await queryRunner.manager.insert('number_sequences', seq);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('number_sequences')
      .where('prefix = :prefix', { prefix: 'AF' })
      .execute();
  }
}
