import {Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, UpdateDateColumn} from 'typeorm';
import {UsersEntity} from "@/libs/database/entities/users.entity";

@Entity("users_profiles")
export class UsersProfilesEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    name: 'fullName',
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  public fullName: string;

  @Column({
    name: 'mobilePhone',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  public mobilePhone: string;

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

  @OneToOne(() => UsersEntity, user => user.profile, { cascade: true })
  @JoinColumn({name: 'userId', referencedColumnName: 'id'})
  public user: UsersEntity;
}
