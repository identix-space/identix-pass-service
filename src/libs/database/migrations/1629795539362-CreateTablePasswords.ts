import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class CreateTablePasswords1629795539362 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'passwords',
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
                        name: 'passwordHash',
                        type: 'varchar',
                        length: '128',
                        isNullable: false
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
        await queryRunner.dropTable('passwords');
    }

}