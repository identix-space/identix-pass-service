import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class CreateTableUserProfile1629793100106 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users_profiles',
                columns: [
                    new TableColumn({
                        name: 'id',
                        type: 'int',
                        isGenerated: true,
                        isPrimary: true,
                        unsigned: true,
                        generationStrategy: 'increment'
                    }),
                    new TableColumn({
                        name: 'fullName',
                        type: 'varchar',
                        length: '256',
                        isNullable: false
                    }),
                    new TableColumn({
                        name: 'department',
                        type: 'varchar',
                        length: '128',
                        isNullable: true,
                        default: 'NULL'
                    }),
                    new TableColumn({
                        name: 'position',
                        type: 'varchar',
                        length: '128',
                        isNullable: true,
                        default: 'NULL'
                    }),
                    new TableColumn({
                        name: 'mobilePhone',
                        type: 'varchar',
                        length: '128',
                        isNullable: true,
                        default: 'NULL'
                    }),
                    new TableColumn({
                        name: 'userId',
                        type: 'int',
                        isNullable: false
                    }),
                    new TableColumn({
                        name: 'updatedAt',
                        type: 'timestamp',
                        isNullable: true,
                        default: 'CURRENT_TIMESTAMP'
                    }),
                    new TableColumn({
                        name: 'createdAt',
                        type: 'timestamp',
                        isNullable: true,
                        default: 'CURRENT_TIMESTAMP'
                    }),
                ],
                foreignKeys: [
                    new TableForeignKey({
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['userId'],
                    }),
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users_profiles');
    }
}