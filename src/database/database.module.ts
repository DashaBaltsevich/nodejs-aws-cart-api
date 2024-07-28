// import { Module } from '@nestjs/common';
// require('dotenv').config();
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { CartEntity } from './entities/cart.entity';
// import { CartItemEntity } from './entities/cart-item.entity';
// import { Pool } from 'pg';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: async () => {
//         return new Pool({
//           type: process.env.DATABASE_TYPE,
//           host: process.env.DATABASE_HOST,
//           user: process.env.DATABASE_USERNAME,
//           password: process.env.DATABASE_PASSWORD,
//           database: process.env.DATABASE_NAME,
//           port: +process.env.DATABASE_PORT,
//           ssl: {
//             rejectUnauthorized: false,
//           },
//           entities: [CartEntity, CartItemEntity],
//         });
//       },
//       inject: [ConfigService],
//     }),
//   ],
// })
// export class DBModule {}

// import { Global, Module, Provider } from '@nestjs/common';
// import { Pool } from 'pg';
// import * as dotenv from 'dotenv';

// const poolProvider: Provider = {
//   provide: 'POSTGRES',
//   useFactory: async () => {
//     return new Pool({
//       host: process.env.DATABASE_HOST,
//       user: process.env.DATABASE_USERNAME,
//       password: process.env.DATABASE_PASSWORD,
//       database: process.env.DATABASE_NAME,
//       port: +process.env.DATABASE_PORT,
//     });
//   },
// };

// @Global()
// @Module({
//   providers: [poolProvider],
//   exports: ['POSTGRES'],
// })
// export class DBModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';
import * as dotenv from 'dotenv';
import { OrderEntity } from './entities/order.entity';
import { UserEntity } from './entities/user.entity';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(
          'HOST',
          configService.get<string>('DATABASE_HOST') +
            parseInt(configService.get<string>('DATABASE_PORT')),
        );
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: parseInt(configService.get<string>('DATABASE_PORT')),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [CartEntity, CartItemEntity, OrderEntity, UserEntity],
          synchronize: false,
          ssl: {
            rejectUnauthorized: false,
          },
          // ssl: false,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      CartEntity,
      CartItemEntity,
      OrderEntity,
      UserEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DBModule {}
