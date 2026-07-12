import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v7 as uuidv7 } from 'uuid';

export class SeedUsers1783838383838 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const passwordHash = await bcrypt.hash('123456', 10);
    const now = new Date();

    const users = [
      // Admins
      { id: uuidv7(), name: 'Admin One', email: 'admin1@gmail.com', password_hash: passwordHash, role: 'ADMIN', status: 'ACTIVE', createdAt: now, updatedAt: now },
      { id: uuidv7(), name: 'Admin Two', email: 'admin2@gmail.com', password_hash: passwordHash, role: 'ADMIN', status: 'ACTIVE', createdAt: now, updatedAt: now },
      
      // Asset Managers
      { id: uuidv7(), name: 'Manager One', email: 'mngr1@gmail.com', password_hash: passwordHash, role: 'ASSET_MANAGER', status: 'ACTIVE', createdAt: now, updatedAt: now },
      { id: uuidv7(), name: 'Manager Two', email: 'mngr2@gmail.com', password_hash: passwordHash, role: 'ASSET_MANAGER', status: 'ACTIVE', createdAt: now, updatedAt: now },
      
      // Department Heads
      { id: uuidv7(), name: 'Dept Head One', email: 'head1@gmail.com', password_hash: passwordHash, role: 'DEPARTMENT_HEAD', status: 'ACTIVE', createdAt: now, updatedAt: now },
      { id: uuidv7(), name: 'Dept Head Two', email: 'head2@gmail.com', password_hash: passwordHash, role: 'DEPARTMENT_HEAD', status: 'ACTIVE', createdAt: now, updatedAt: now },
      
      // Employees
      { id: uuidv7(), name: 'Employee One', email: 'emp1@gmail.com', password_hash: passwordHash, role: 'EMPLOYEE', status: 'ACTIVE', createdAt: now, updatedAt: now },
      { id: uuidv7(), name: 'Employee Two', email: 'emp2@gmail.com', password_hash: passwordHash, role: 'EMPLOYEE', status: 'ACTIVE', createdAt: now, updatedAt: now },
      { id: uuidv7(), name: 'Employee Three', email: 'emp3@gmail.com', password_hash: passwordHash, role: 'EMPLOYEE', status: 'ACTIVE', createdAt: now, updatedAt: now },
    ];

    // Bulk insert users using TypeORM manager in a single database operation.
    await queryRunner.manager.insert('users', users);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const emails = [
      'admin1@gmail.com', 'admin2@gmail.com',
      'mngr1@gmail.com', 'mngr2@gmail.com',
      'head1@gmail.com', 'head2@gmail.com',
      'emp1@gmail.com', 'emp2@gmail.com', 'emp3@gmail.com'
    ];
    
    // Bulk delete based on emails using TypeORM QueryBuilder
    await queryRunner.manager.createQueryBuilder()
      .delete()
      .from('users')
      .where('email IN (:...emails)', { emails })
      .execute();
  }
}

