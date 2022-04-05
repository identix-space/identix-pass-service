import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  Table
} from "typeorm";

export class CreateTableUsers1629793100105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`
      CREATE TYPE "users_status_types" AS ENUM(
          'ACTIVE',
          'INVITED',
          'BLOCKED'
        )
      `);

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
            unsigned: true,
            generationStrategy: 'increment',
          }),
          new TableColumn({
            name: 'address',
            type: 'varchar',
            length: '128',
            isNullable: false,
            isUnique: true
          }),
          new TableColumn({
            name: 'email',
            type: 'varchar',
            length: '128',
            isNullable: true
          }),
          new TableColumn({
            name: 'status',
            type: 'users_status_types',
            isNullable: true
          }),
          new TableColumn({
            name: 'lastActivity',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP'
          }),
          new TableColumn({
            name: 'nonce',
            type: 'varchar',
            length: '128',
            isNullable: true
          }),
          new TableColumn({
            name: 'createdAt',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP',
          }),
          new TableColumn({
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP',
          }),
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
