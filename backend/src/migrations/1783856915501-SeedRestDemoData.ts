import { MigrationInterface, QueryRunner } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

export class SeedRestDemoData1783856915501 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const now = new Date();

    // Fetch users
    const users = await queryRunner.manager.query(`SELECT id, email, role FROM users`);
    const employees = users.filter((u: any) => u.role === 'EMPLOYEE');
    const auditors = users.filter((u: any) => u.role === 'ADMIN' || u.role === 'ASSET_MANAGER');

    if (employees.length === 0 || auditors.length === 0) {
      console.warn('Skipping rest demo data seeding: Required users not found.');
      return;
    }

    // Fetch assets
    const assets = await queryRunner.manager.query(`SELECT id, asset_tag, is_shared_bookable FROM assets`);
    const sharedAssets = assets.filter((a: any) => a.is_shared_bookable === 1 || a.is_shared_bookable === true);
    
    // Fetch departments
    const departments = await queryRunner.manager.query(`SELECT id, name FROM departments`);
    const itDept = departments.find((d: any) => d.name === 'IT Department');

    // 1. Seed Resource Bookings
    const bookings = [];
    if (sharedAssets.length > 0) {
      bookings.push({
        id: uuidv7(),
        asset_id: sharedAssets[0].id,
        booked_by_user_id: employees[0].id,
        start_time: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        end_time: new Date(now.getTime() + 48 * 60 * 60 * 1000), // Day after tomorrow
        status: 'UPCOMING'
      });
      await queryRunner.manager.insert('resource_bookings', bookings);
    }

    // 2. Seed Audit Cycles
    const auditCycleId = uuidv7();
    const auditCycles = [
      {
        id: auditCycleId,
        name: 'Q3 IT Equipment Audit',
        target_department_id: itDept ? itDept.id : null,
        start_date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // A week ago
        end_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // A week from now
        status: 'OPEN'
      }
    ];
    await queryRunner.manager.insert('audit_cycles', auditCycles);

    // 3. Seed Audit Items
    if (assets.length > 0) {
      const auditItems = [
        {
          id: uuidv7(),
          audit_cycle_id: auditCycleId,
          asset_id: assets[0].id,
          auditor_id: auditors[0].id,
          verification_status: 'VERIFIED',
          notes: 'Condition looks good.'
        }
      ];

      if (assets.length > 1) {
        auditItems.push({
          id: uuidv7(),
          audit_cycle_id: auditCycleId,
          asset_id: assets[1].id,
          auditor_id: auditors[0].id,
          verification_status: 'DAMAGED',
          notes: 'Screen has a small scratch.'
        });
      }

      await queryRunner.manager.insert('audit_items', auditItems);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.createQueryBuilder().delete().from('audit_items').execute();
    await queryRunner.manager.createQueryBuilder().delete().from('audit_cycles').execute();
    await queryRunner.manager.createQueryBuilder().delete().from('resource_bookings').execute();
  }
}
