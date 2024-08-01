import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { CartModule } from 'src/cart/cart.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, CartModule],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
