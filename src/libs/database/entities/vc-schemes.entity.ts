import {Entity, PrimaryGeneratedColumn} from "typeorm";
import {Field, Int} from "@nestjs/graphql";

@Entity("vc-schemes")
export class VCSchemesEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;
}