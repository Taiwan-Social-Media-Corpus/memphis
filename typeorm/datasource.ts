require('dotenv').config();

import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: ['libs/postgres/src/models/entities/**/*.entity.ts'],
  migrationsTableName: '_Migration',
  migrations: ['typeorm/migrations/**/*.ts'],
});

export default dataSource;
