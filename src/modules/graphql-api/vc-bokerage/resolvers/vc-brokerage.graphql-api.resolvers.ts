import {Resolver} from '@nestjs/graphql';
import {VCBrokerageGraphqlApiService} from "@/modules/graphql-api/vc-bokerage/services/vc-brokerage.graphql-api.service";
@Resolver('VCBrokerage')
export class VcBrokerageGraphqlApiResolvers {
  constructor(
    private vcBrokerageGraphqlAPIService: VCBrokerageGraphqlApiService,
  ) {
  }
}