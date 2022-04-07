import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import {Field, Int, ObjectType} from "@nestjs/graphql";


@Entity("users")
@ObjectType()
export class UsersEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  @Field({nullable: false})
  public email: string;

  @Column({
    name: 'address',
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  @Field({nullable: true})
  public address: string;

  @Column({
    name: 'lastActivity',
    type: 'timestamp',
    nullable: false
  })
  @Field({nullable: false})
  public lastActivity: Date;

  @Column({
    name: 'nonce',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  @Field({nullable: true})
  public nonce: string;

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    nullable: true,
    default: 'CURRENT_TIMESTAMP'
  })
  @Field({nullable: false})
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp',
    nullable: true,
    default: 'CURRENT_TIMESTAMP'
  })
  @Field({nullable: false})
  public updatedAt: Date;
}

export class UsersListSearchResult {
  @Field(type => [UsersEntity])
  public users: UsersEntity[];

  @Field(type => Int)
  public total: number;
}

