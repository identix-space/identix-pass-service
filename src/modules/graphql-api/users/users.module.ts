import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import {UsersEntity} from "@/libs/database/entities";
import {LoggingModule} from "@/libs/logging/logging.module";
import {UsersService} from "@/modules/graphql-api/users/services/users.service";
import {UsersResolvers} from "@/modules/graphql-api/users/resolvers/users.resolvers";

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    LoggingModule.forRoot({serviceName: 'Users GraphQL module'})
  ],
  providers: [UsersResolvers, UsersService],
  exports: [UsersService]
})
export class UsersModule {}
