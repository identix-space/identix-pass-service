import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ILike, Repository} from "typeorm";
import {FindManyOptions} from "typeorm/find-options/FindManyOptions";

import {UsersEntity, UsersListSearchResult} from "@/libs/database/entities";
import {TUserUpdate, TUserCreate} from "@/modules/graphql-api/users/types";

@Injectable()
export class UsersGraphqlApiService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>
  ) {}

  async create(data: TUserCreate): Promise<UsersEntity> {
    const { email, nonce, address, lastActive } = data;

    if (!email) {
      throw new Error("Email is required");
    }

    let user = await this.usersRepository.findOne({ email });
    if (user) {
      throw new Error("User already exists");
    }

    user = new UsersEntity();
    user.email = email;
    user.nonce = nonce;
    user.address = address;
    user.lastActivity = lastActive || new Date();

    await this.usersRepository.save(user);

    return user;
  }

  async findById(id: number): Promise<UsersEntity> {
    return this.usersRepository.findOne(id);
  }

  async findAll(searchText: string = '', take: number = 10, skip: number = 0): Promise<UsersListSearchResult> {
    const query = searchText ? {
      where: [
        {name: ILike('%'+searchText+'%')}
      ]
    } : {};

    const getQuery = {
      ...query,
      take,
      skip,
      order: {
        name: "ASC",
      }
    };
    const [total, users] = await Promise.all([this.usersRepository.count(query), this.usersRepository.find(getQuery as FindManyOptions)])

    return { users, total } as UsersListSearchResult;
  }

  async updateById(id: number, data: TUserUpdate): Promise<UsersEntity> {
    await this.usersRepository.update({id}, data)
    return this.findById(id)
  }

  async deleteById(id: number): Promise<boolean> {
    return !!(await this.usersRepository.delete({id}))
  }
}