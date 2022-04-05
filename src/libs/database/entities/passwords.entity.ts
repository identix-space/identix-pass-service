import {Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, UpdateDateColumn} from 'typeorm';
import {UsersEntity} from "@/libs/database/entities/users.entity";

@Entity("passwords")
export class PasswordsEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    name: 'passwordHash',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  public passwordHash: string;

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    nullable: true,
    default: 'CURRENT_TIMESTAMP'
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp',
    nullable: true,
    default: 'CURRENT_TIMESTAMP'
  })
  public updatedAt: Date;

  @OneToOne(() => UsersEntity, user => user.password)
  @JoinColumn({
    name: 'userId'
  })
  public user: UsersEntity;
}
