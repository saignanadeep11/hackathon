import { MigrationInterface, QueryRunner } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

export class SeedCategories1783838383840 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const categories = [
      {
        id: uuidv7(),
        name: 'Electronics',
        custom_fields_schema: JSON.stringify({
          fields: [
            { name: 'warranty_period', label: 'Warranty Period (Months)', type: 'number', required: true },
            { name: 'model_number', label: 'Model Number', type: 'text', required: false },
          ],
        }),
      },
      {
        id: uuidv7(),
        name: 'Furniture',
        custom_fields_schema: JSON.stringify({
          fields: [
            { name: 'material', label: 'Material (e.g. Wood, Steel)', type: 'text', required: true },
            { name: 'dimensions', label: 'Dimensions (WxDxH)', type: 'text', required: false },
          ],
        }),
      },
      {
        id: uuidv7(),
        name: 'Vehicles',
        custom_fields_schema: JSON.stringify({
          fields: [
            { name: 'license_plate', label: 'License Plate', type: 'text', required: true },
            { name: 'year', label: 'Year of Manufacture', type: 'number', required: true },
          ],
        }),
      },
    ];

    await queryRunner.manager.insert('asset_categories', categories);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.createQueryBuilder()
      .delete()
      .from('asset_categories')
      .execute();
  }
}
