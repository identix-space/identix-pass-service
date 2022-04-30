import {Module} from '@nestjs/common';

import {LoggingModule} from "@/libs/logging/logging.module";
import {WalletsStorageService} from "@/libs/wallets-storage-client/services/wallets-storage-client.service";
import {WalletsStorageClientProvider} from "@/libs/wallets-storage-client/providers/wallets-storage-client.provider";

@Module({
  imports: [
    LoggingModule.forRoot({serviceName: 'VC Storage module'})
  ],
  providers: [WalletsStorageClientProvider, WalletsStorageService],
  exports: [WalletsStorageClientProvider]
})
export class WalletsSrorageClientModule {}
