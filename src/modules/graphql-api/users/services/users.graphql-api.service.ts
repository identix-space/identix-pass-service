import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {UsersEntity, UsersListSearchResult} from "@/libs/database/entities";
import {TUserCreate} from "@/modules/graphql-api/users/types";

@Injectable()
export class UsersGraphqlApiService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>
  ) {}

  async create(data: TUserCreate): Promise<UsersEntity> {
    const { did, lastActive } = data;

    if (!did) {
      throw new Error("Did is required");
    }

    let user = await this.usersRepository.findOne({ did });
    if (user) {
      throw new Error("User already exists");
    }

    user = new UsersEntity();
    user.did = did;
    user.lastActivity = lastActive || new Date();

    await this.usersRepository.save(user);

    return user;
  }

  async findById(id: number): Promise<UsersEntity> {
    return this.usersRepository.findOne(id);
  }

  async findByDid(did: string): Promise<UsersEntity> {
    return this.usersRepository.findOne({did});
  }

  async deleteById(id: number): Promise<boolean> {
    return !!(await this.usersRepository.delete({id}))
  }
}