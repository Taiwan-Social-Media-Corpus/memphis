import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import config from '@memphis/config';
import {
  CsrfMiddleware,
  CookieMiddleware,
  CookieModule,
} from '@memphis/cookie';
import { repositories } from '@memphis/admin/infrastructure/repositories';
import { JwtModule } from '@memphis/jwt';
import { PostgresModule } from '@memphis/postgres';
import { adminServices } from '../application/services/admins';
import { cqrsHandlers } from '../application/use-cases';
import { eventHandlers } from './events';
import { adminControllers } from '../presentation';

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
  ],
  controllers: adminControllers,
  providers: [
    ...adminServices,
    ...repositories,
    ...cqrsHandlers,
    ...eventHandlers,
  ],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieMiddleware)
      .forRoutes('*')
      .apply(CsrfMiddleware)
      .exclude(
        { path: 'admin', method: RequestMethod.POST },
        { path: 'admin/sessions', method: RequestMethod.POST },
        '_ping',
      )
      .forRoutes(...adminControllers);
  }
}
