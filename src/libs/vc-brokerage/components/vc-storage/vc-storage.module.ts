import {Module} from '@nestjs/common';

import {LoggingModule} from "@/libs/logging/logging.module";
import {VcStorageService} from "@/libs/vc-brokerage/components/vc-storage/services/vc-storage.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {VCSchemesEntity, VCStorageEntity} from "@/libs/database/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([VCSchemesEntity, VCStorageEntity]),
    LoggingModule.forRoot({serviceName: 'VC Storage module'})
  ],
  providers: [VcStorageService],
  exports: [VcStorageService]
})
export class VcStorageModule {}