import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { OrderEntity } from './entities/order.entity';
import { CartEntity } from './entities/cart.entity';
import { UserEntity } from './entities/user.entity';
import { CartItemEntity } from './entities/cart-item.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: parseInt(configService.get<string>('DB_PORT')),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [CartEntity, CartItemEntity, OrderEntity, UserEntity],
          synchronize: true,
          logging: true,
          namingStrategy: new SnakeNamingStrategy(),
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
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
export class DatabaseModule {}
