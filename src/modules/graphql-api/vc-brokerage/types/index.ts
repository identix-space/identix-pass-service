import {Field, ObjectType} from "@nestjs/graphql";
import {Did} from "@/libs/vc-brokerage/types"

@ObjectType()
export class VcTypeInfo {
  @Field(type => String)
  vcTypeDid: Did;

  @Field(type => String)
  vcTypeTag: string
}
