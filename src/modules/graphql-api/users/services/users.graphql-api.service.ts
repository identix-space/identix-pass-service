import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {UsersEntity} from "@/libs/database/entities";
import {Did} from "@/libs/vc-brokerage/types";

@Injectable()
export class UsersGraphqlApiService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>
  ) {}

  async checkAccountExists(did: Did): Promise<boolean> {
    return true;
  }
}
