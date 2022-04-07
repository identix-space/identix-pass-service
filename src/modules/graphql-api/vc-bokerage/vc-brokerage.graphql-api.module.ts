import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import {UsersEntity} from "@/libs/database/entities";
import {LoggingModule} from "@/libs/logging/logging.module";
import {VCBrokerageGraphqlApiService} from "@/modules/graphql-api/vc-bokerage/services/vc-brokerage.graphql-api.service";
import {VcBrokerageGraphqlApiResolvers} from "@/modules/graphql-api/vc-bokerage/resolvers/vc-brokerage.graphql-api.resolvers";

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    LoggingModule.forRoot({serviceName: 'Users GraphQL module'})
  ],
  providers: [VcBrokerageGraphqlApiResolvers, VCBrokerageGraphqlApiService],
  exports: [VCBrokerageGraphqlApiService]
})
export class VcBrokerageGraphqlApiModule {}
