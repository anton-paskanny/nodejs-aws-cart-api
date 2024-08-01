import { v4 } from 'uuid';
import { DataSource, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { OrderType } from '../models';

import { OrderEntity } from 'src/database/entities/order.entity';
import { CartService, CartStatuses } from 'src/cart';
import { CartEntity } from 'src/database/entities/cart.entity';

@Injectable()
export class OrderService {
  constructor(
    private cartService: CartService,

    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,

    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async findById(orderId: string): Promise<OrderEntity> {
    return await this.orderRepo.findOneBy({ id: orderId });
  }

  async createOrder(data: OrderType): Promise<OrderEntity> {
    console.log('[OrderService], createOrder, data: ', data);

    try {
      const id = v4();

      const newOrder = this.orderRepo.create({
        id,
        ...data,
      });

      console.log('[OrderService], createOrder, newOrder: ', newOrder);

      const order = await this.dataSource.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(OrderEntity, newOrder);

          const cart = await this.cartService.findOpenCartByUserId(data.userId);
          cart.status = CartStatuses.ORDERED;

          console.log(
            '[OrderService], createOrder, new cart with updated status: ',
            cart,
          );
          await transactionalEntityManager.save(CartEntity, cart);

          const cartItems = await this.cartService.findItemsByCartId(cart.id);

          console.log(
            '[OrderService], createOrder, cartItems to put into order: ',
            cartItems,
          );

          return { ...newOrder, items: cartItems };
        },
      );

      console.log(
        '[OrderService], createOrder, order after transaction: ',
        order,
      );

      return order;
    } catch (error) {
      console.log('[OrderService], createOrder, error: ', error);
    }
  }

  async updateOrder(orderId: string, data: OrderType): Promise<void> {
    console.log('[OrderService], updateOrder, orderId: ', orderId);
    console.log('[OrderService], updateOrder, data: ', data);

    try {
      const order = await this.findById(orderId);

      if (!order) {
        console.log('[OrderService], updateOrder, order does not exist');
        throw new Error('Order does not exist');
      }

      const newOrder = this.orderRepo.create({
        id: orderId,
        ...data,
      });

      console.log('[OrderService], updateOrder, newOrder: ', newOrder);

      await this.orderRepo.save(newOrder);

      console.log(
        `[OrderService], updateOrder, newOrder with ${newOrder.id} was saved successfully!`,
      );
    } catch (error) {
      console.log('[OrderService], updateOrder, error: ', error);
    }
  }
}
