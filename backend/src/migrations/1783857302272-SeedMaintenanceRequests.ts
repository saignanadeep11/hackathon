import { MigrationInterface, QueryRunner } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

export class SeedMaintenanceRequests1783857302272 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Fetch users
    const users = await queryRunner.manager.query(`SELECT id, email, role FROM users`);
    const employees = users.filter((u: any) => u.role === 'EMPLOYEE');

    if (employees.length === 0) {
      console.warn('Skipping maintenance data seeding: Required users not found.');
      return;
    }

    // Fetch assets
    const assets = await queryRunner.manager.query(`SELECT id, asset_tag, status FROM assets`);
    if (assets.length < 3) {
      console.warn('Skipping maintenance data seeding: Not enough assets found.');
      return;
    }

    const maintenanceRequests = [
      {
        id: uuidv7(),
        asset_id: assets[0].id,
        raised_by_user_id: employees[0].id,
        technician_name: null,
        description: 'Screen flickering intermittently during use.',
        priority: 'HIGH',
        photo_url: null,
        status: 'PENDING'
      },
      {
        id: uuidv7(),
        asset_id: assets[1].id,
        raised_by_user_id: employees[1 % employees.length].id,
        technician_name: 'Alice Tech',
        description: 'Battery does not hold charge.',
        priority: 'MEDIUM',
        photo_url: null,
        status: 'APPROVED'
      },
      {
        id: uuidv7(),
        asset_id: assets[2].id,
        raised_by_user_id: employees[2 % employees.length].id,
        technician_name: 'Bob Fixit',
        description: 'Keyboard missing a key (Enter).',
        priority: 'LOW',
        photo_url: null,
        status: 'RESOLVED'
      },
      {
        id: uuidv7(),
        asset_id: assets[0].id,
        raised_by_user_id: employees[0].id,
        technician_name: null,
        description: 'Requesting preventive maintenance.',
        priority: 'LOW',
        photo_url: null,
        status: 'REJECTED'
      }
    ];

    await queryRunner.manager.insert('maintenance_requests', maintenanceRequests);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Note: Since we don't have a reliable way to distinguish these specific demo requests 
    // from the initial SeedDemoData maintenance request, we will delete all maintenance requests 
    // that are not IN_PROGRESS (the one from SeedDemoData was IN_PROGRESS).
    await queryRunner.manager.createQueryBuilder()
      .delete()
      .from('maintenance_requests')
      .where("status != 'IN_PROGRESS'")
      .execute();
  }
}
