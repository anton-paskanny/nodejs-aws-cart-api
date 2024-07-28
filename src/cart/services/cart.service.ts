import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';

import { CartEntity } from 'src/database/entities/cart.entity';
import { CartItemEntity } from 'src/database/entities/cart-item.entity';

import { CartStatuses } from '../models';
import { UpdateCartDto } from '../dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepo: Repository<CartEntity>,

    @InjectRepository(CartItemEntity)
    private readonly cartItemRepo: Repository<CartItemEntity>,
  ) {}

  async findByUserId(userId: string): Promise<CartEntity | null> {
    return await this.cartRepo.findOneBy({ userId });
  }

  async createByUserId(userId: string): Promise<CartEntity> {
    try {
      const id = v4();

      const newCart = this.cartRepo.create({
        id,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: CartStatuses.OPEN,
      });

      const userCart = await this.cartRepo.save(newCart);

      return userCart;
    } catch (error) {
      console.log('[CartService], createByUserId, error: ', error);
    }
  }

  async findOrCreateByUserId(userId: string): Promise<CartEntity> {
    console.log(`[CartService], findOrCreateByUserId, userId: ${userId}`);

    const userCart = await this.findByUserId(userId);

    if (userCart) {
      console.log(
        `[CartService], findOrCreateByUserId, user cart already exists for the user with ${userId} id`,
      );
      return userCart;
    }

    const newUserCart = await this.createByUserId(userId);
    console.log(
      `[CartService], findOrCreateByUserId, new cart was created with ${newUserCart.id} id`,
    );
    return newUserCart;
  }

  async findItemsByCartId(cartId: string) {
    return await this.cartItemRepo.findBy({ cartId });
  }

  async updateByUserId(userId: string, updateCartDto: UpdateCartDto) {
    console.log('[CartService], updateByUserId, userId: ', userId);

    const { items } = updateCartDto;

    let userCart;

    try {
      userCart = await this.findOrCreateByUserId(userId);
    } catch (error) {
      console.log('[CartService], updateByUserId, error: ', error);
    }

    if (!userCart) {
      console.log(
        `[CartService], updateByUserId, cart is not found for the user with ${userId} id`,
      );
      throw new Error(`Cart is not found for the user with ${userId} id`);
    }

    try {
      for (const item of items) {
        const newCartItem = this.cartItemRepo.create({
          cartId: userCart.id,
          productId: item.productId,
          count: item.count,
        });

        console.log(
          `[CartService], updateByUserId, newCartItem to save:  ${newCartItem}`,
        );

        await this.cartItemRepo.save(newCartItem);
      }
    } catch (error) {
      console.log(
        '[CartService], updateByUserId, error with CartItemRepo: ',
        error,
      );
    }

    userCart.updatedAt = new Date().toISOString();

    try {
      console.log(
        '[CartService], updateByUserId, userCart to save: ',
        userCart,
      );

      await this.cartRepo.save(userCart);
    } catch (error) {
      console.log(
        '[CartService], updateByUserId, error with cartRepo.save: ',
        error,
      );
    }

    return userCart;
  }

  async removeByUserId(userId: string): Promise<void> {
    console.log(`[CartService], removeByUserId, userId: ${userId}`);

    try {
      const userCart = await this.findByUserId(userId);

      if (!userCart) {
        console.log(
          `[CartService], removeByUserId, cart is not found for the user with ${userId} id`,
        );
        throw new Error(`Cart is not found for the user with ${userId} id`);
      } else {
        await this.cartRepo.delete({ userId });
        console.log(
          `[CartService], removeByUserId, cart was deleted for the user with ${userId} id`,
        );
      }
    } catch (error) {
      console.log('[CartService], removeByUserId, error: ', error);
    }
  }
}
