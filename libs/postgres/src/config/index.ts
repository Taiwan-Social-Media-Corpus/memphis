import { config } from '@memphis/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

const { pgDB, pgHost, pgPassword, pgPort, pgUser } = config;

const typeOrmOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: pgHost,
  port: pgPort,
  username: pgUser,
  password: pgPassword,
  database: pgDB,
  synchronize: false,
  logging: false,
};

export default typeOrmOptions;
