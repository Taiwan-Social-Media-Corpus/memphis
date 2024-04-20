import { ConfigModule } from '@nestjs/config';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '@memphis/config';
import typeOrmOptions from './config';
import { entities } from './models/entities';
import { repositories } from './models/repositories';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      cache: true,
    }),
    TypeOrmModule.forRoot({ ...typeOrmOptions, entities }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [...repositories],
  exports: [TypeOrmModule, ...repositories],
})
@Global()
export class PostgresModule {}
