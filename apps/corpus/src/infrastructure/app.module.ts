import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  CsrfMiddleware,
  CookieMiddleware,
  CookieModule,
} from '@memphis/cookie';
import { JwtModule } from '@memphis/jwt';
import { ConfigModule } from '@nestjs/config';
import config from '@memphis/config';
import { PostgresModule } from '@memphis/postgres';
import { corpusControllers } from '@memphis/corpus/presentation';
import { CqrsModule } from '@nestjs/cqrs';
import { cqrsHandlers } from '@memphis/corpus/application/use-cases';
import { userServices } from '../application/services/users';
import { repositories } from './repositories';
import { eventHandlers } from './events';
import { OauthModule } from '@memphis/oauth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      cache: true,
    }),
    PostgresModule,
    CqrsModule,
    JwtModule,
    CookieModule,
    OauthModule,
  ],
  controllers: corpusControllers,
  providers: [
    ...cqrsHandlers,
    ...userServices,
    ...repositories,
    ...eventHandlers,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieMiddleware)
      .forRoutes('*')
      .apply(CsrfMiddleware)
      .exclude('user/_ping')
      .forRoutes(...corpusControllers);
  }
}
