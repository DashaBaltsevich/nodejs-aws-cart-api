import { DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();
import 'dotenv/config';
import { CartEntity } from '../entities/cart.entity';
import { CartItemEntity } from '../entities/cart-item.entity';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const host = DB_HOST;
const port = Number(DB_PORT);
const username = DB_USER;
const password = DB_PASSWORD;
const database = DB_NAME;

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
  entities: [CartEntity, CartItemEntity],
  synchronize: false,
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
};
