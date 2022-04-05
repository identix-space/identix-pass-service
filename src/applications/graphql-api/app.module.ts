import {Connection} from 'typeorm';
import {Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {DatabaseModule} from "@/libs/database/database.module";
import {LoggingModule} from "@/libs/logging/logging.module";
import {AppLoggerMiddleware} from "@/libs/logging/middlewares/app-logger.middleware";
import {GraphQLAppModule} from "@/libs/graphql/graphql.module";
import {UsersModule} from "@/modules/graphql-api/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLAppModule.forRoot(),
    LoggingModule.forRoot({serviceName: 'Nest.JS GraphQL API'}),
    UsersModule,
  ],
  providers: [],
  controllers: []
})
export class AppModule implements NestModule {
  constructor(private connection: Connection) {
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}