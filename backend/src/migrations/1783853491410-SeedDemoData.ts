import { MigrationInterface, QueryRunner } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

export class SeedDemoData1783853491410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const now = new Date();
    
    // Fetch users
    const users = await queryRunner.manager.query(`SELECT id, email, role FROM users`);
    const admins = users.filter((u: any) => u.role === 'ADMIN');
    const heads = users.filter((u: any) => u.role === 'DEPARTMENT_HEAD');
    const employees = users.filter((u: any) => u.role === 'EMPLOYEE');

    if (heads.length < 2 || employees.length < 3) {
       console.warn('Skipping demo data seeding: Required users not found.');
       return;
    }

    // Fetch categories
    const categories = await queryRunner.manager.query(`SELECT id, name FROM asset_categories`);
    const electronics = categories.find((c: any) => c.name === 'Electronics');
    const furniture = categories.find((c: any) => c.name === 'Furniture');
    const vehicles = categories.find((c: any) => c.name === 'Vehicles');

    if (!electronics || !furniture || !vehicles) {
      console.warn('Skipping demo data seeding: Required categories not found.');
      return;
    }

    // 1. Seed Departments
    const itDeptId = uuidv7();
    const hrDeptId = uuidv7();
    const engDeptId = uuidv7();

    const departments = [
      { id: itDeptId, name: 'IT Department', status: 'ACTIVE', head_id: heads[0]?.id },
      { id: hrDeptId, name: 'Human Resources', status: 'ACTIVE', head_id: heads[1]?.id },
      { id: engDeptId, name: 'Engineering', status: 'ACTIVE', head_id: heads[0]?.id },
    ];

    await queryRunner.manager.insert('departments', departments);

    // Link Employees to Departments
    await queryRunner.manager.update('users', { id: employees[0].id }, { department_id: itDeptId });
    await queryRunner.manager.update('users', { id: employees[1].id }, { department_id: hrDeptId });
    await queryRunner.manager.update('users', { id: employees[2].id }, { department_id: engDeptId });

    // 2. Seed Assets
    const macbookId = uuidv7();
    const monitorId = uuidv7();
    const chairId = uuidv7();
    const deskId = uuidv7();
    const vanId = uuidv7();

    const assets = [
      {
        id: macbookId,
        asset_tag: 'AF-1001',
        name: 'MacBook Pro M3',
        serial_number: 'C02ZG000MD6R',
        category_id: electronics.id,
        acquisition_date: new Date('2024-01-15'),
        acquisition_cost: 2500.00,
        condition: 'Good',
        location: 'HQ-1st Floor',
        is_shared_bookable: false,
        status: 'ALLOCATED',
        custom_fields_data: JSON.stringify({ warranty_period: 36, model_number: 'A2992' })
      },
      {
        id: monitorId,
        asset_tag: 'AF-1002',
        name: 'Dell UltraSharp 27',
        serial_number: 'DELL-US27-01',
        category_id: electronics.id,
        acquisition_date: new Date('2023-11-10'),
        acquisition_cost: 600.00,
        condition: 'Excellent',
        location: 'HQ-2nd Floor',
        is_shared_bookable: false,
        status: 'AVAILABLE',
        custom_fields_data: JSON.stringify({ warranty_period: 24, model_number: 'U2723QE' })
      },
      {
        id: chairId,
        asset_tag: 'AF-2001',
        name: 'Herman Miller Aeron',
        serial_number: 'HMA-123456',
        category_id: furniture.id,
        acquisition_date: new Date('2022-05-20'),
        acquisition_cost: 1200.00,
        condition: 'Needs Repair',
        location: 'HQ-3rd Floor',
        is_shared_bookable: false,
        status: 'UNDER_MAINTENANCE',
        custom_fields_data: JSON.stringify({ material: 'Mesh/Plastic', dimensions: '27x17x41' })
      },
      {
        id: deskId,
        asset_tag: 'AF-2002',
        name: 'Standing Desk Pro',
        serial_number: 'SDP-987654',
        category_id: furniture.id,
        acquisition_date: new Date('2023-01-05'),
        acquisition_cost: 800.00,
        condition: 'Good',
        location: 'HQ-1st Floor',
        is_shared_bookable: false,
        status: 'AVAILABLE',
        custom_fields_data: JSON.stringify({ material: 'Wood/Steel', dimensions: '60x30x25-50' })
      },
      {
        id: vanId,
        asset_tag: 'AF-3001',
        name: 'Delivery Van Ford Transit',
        serial_number: 'VIN-1FADG1234',
        category_id: vehicles.id,
        acquisition_date: new Date('2021-08-12'),
        acquisition_cost: 45000.00,
        condition: 'Good',
        location: 'Warehouse A',
        is_shared_bookable: true,
        status: 'AVAILABLE',
        custom_fields_data: JSON.stringify({ license_plate: 'ABC-123', year: 2021 })
      }
    ];

    await queryRunner.manager.insert('assets', assets);

    // 3. Seed Allocations
    const allocationId = uuidv7();
    const allocations = [
      {
        id: allocationId,
        asset_id: macbookId,
        allocated_to_user_id: employees[0].id,
        allocated_to_department_id: null,
        requested_by_id: employees[0].id,
        expected_return_date: new Date('2027-01-15'),
        return_date: null,
        status: 'ACTIVE',
        check_in_notes: null
      }
    ];
    await queryRunner.manager.insert('asset_allocations', allocations);

    // 4. Seed Maintenance Requests
    const maintenanceId = uuidv7();
    const maintenanceRequests = [
      {
        id: maintenanceId,
        asset_id: chairId,
        raised_by_user_id: employees[1].id,
        technician_name: 'Bob Fixit',
        description: 'Armrest is loose and hydraulic cylinder sinks slowly.',
        priority: 'MEDIUM',
        photo_url: null,
        status: 'IN_PROGRESS'
      }
    ];
    await queryRunner.manager.insert('maintenance_requests', maintenanceRequests);

    // 5. Activity Logs for Demo
    const logs = [
      {
        id: uuidv7(),
        type: 'ALLOCATION',
        message: 'MacBook Pro M3 allocated to Employee One',
        actor_id: admins[0]?.id || employees[0].id,
        target_user_id: employees[0].id,
        entity_id: allocationId,
        is_read: false,
        created_at: now
      },
      {
        id: uuidv7(),
        type: 'MAINTENANCE',
        message: 'Maintenance request raised for Herman Miller Aeron',
        actor_id: employees[1].id,
        target_user_id: null,
        entity_id: maintenanceId,
        is_read: false,
        created_at: now
      }
    ];
    await queryRunner.manager.insert('activity_logs', logs);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete in reverse order of creation
    await queryRunner.manager.createQueryBuilder().delete().from('activity_logs').execute();
    await queryRunner.manager.createQueryBuilder().delete().from('maintenance_requests').execute();
    await queryRunner.manager.createQueryBuilder().delete().from('asset_allocations').execute();
    
    // Unlink users from departments before deleting departments
    await queryRunner.manager.createQueryBuilder()
      .update('users')
      .set({ department_id: null })
      .execute();

    await queryRunner.manager.createQueryBuilder().delete().from('assets').execute();
    await queryRunner.manager.createQueryBuilder().delete().from('departments').execute();
  }
}
