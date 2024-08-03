import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  Post,
  UseGuards,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';

import { BasicAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { CartService } from './services';
import { CartItemDto } from './dto/update-cart.dto';
import { CartStatuses } from './models';
import { CheckoutCartDto } from './dto/checkout-cart.dto';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    try {
      const userIdFromReq = getUserIdFromRequest(req);

      console.log(
        '[CartController], findUserCart, userIdFromReq: ',
        userIdFromReq,
      );

      const cart = await this.cartService.findOrCreateByUserId(userIdFromReq);

      console.log('[CartController], findUserCart, cart', cart);

      const cartItems = await this.cartService.findItemsByCartId(cart.id);

      console.log('[CartController], findUserCart, items in cart', cartItems);

      const result = {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
          ...cart,
          items: cartItems,
        },
      };

      console.log('[CartController], findUserCart, result: ', cartItems);

      return result;
    } catch (error) {
      console.log('[CartController], findUserCart, error: ', error);
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(
    @Req() req: AppRequest,
    @Body(new ValidationPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
    updateCartDto: CartItemDto,
  ) {
    const userIdFromReq = getUserIdFromRequest(req);

    console.log(
      '[CartController], updateUserCart, userIdFromReq: ',
      userIdFromReq,
    );

    console.log(
      '[CartController], updateUserCart, updateCartDto: ',
      updateCartDto,
    );

    try {
      const cart = await this.cartService.updateByUserId(
        userIdFromReq,
        updateCartDto,
      );

      console.log('[CartController], updateUserCart, updatedCart: ', cart);

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
          cart,
        },
      };
    } catch (error) {
      console.log('[CartController], updateUserCart, error: ', error);
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest) {
    const userIdFromReq = getUserIdFromRequest(req);

    console.log(
      '[CartController], clearUserCart, userIdFromReq: ',
      userIdFromReq,
    );

    try {
      await this.cartService.removeByUserId(userIdFromReq);
    } catch (error) {
      console.log('[CartController], clearUserCart, error: ', error);
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }

    console.log(
      `[CartController], clearUserCart, cart was removed for the suer with ${userIdFromReq} id.`,
      userIdFromReq,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(
    @Req() req: AppRequest,
    @Body(new ValidationPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }))
    checkoutCartDto: CheckoutCartDto,
  ) {
    const userIdFromReq = getUserIdFromRequest(req);

    console.log('[CartController], checkout, userIdFromReq: ', userIdFromReq);

    if (!userIdFromReq) {
      console.log('[CartController], checkout, No user id in the request');
      return;
    }

    console.log(
      '[CartController], checkout, checkoutCartDto: ',
      checkoutCartDto,
    );

    try {
      const cart = await this.cartService.findOpenCartByUserId(userIdFromReq);

      console.log('[CartController], checkout, cart: ', cart);

      const cartItems = await this.cartService.findItemsByCartId(cart.id);

      console.log('[CartController], checkout, cartItems: ', cartItems);

      if (!cart && !cartItems.length) {
        console.log('[CartController], checkout, cart is empty');

        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Error: cart is empty',
        };
      }

      const order = await this.orderService.createOrder({
        userId: userIdFromReq,
        cartId: cart.id,
        status: CartStatuses.ORDERED,
        total: cartItems.length,
        ...checkoutCartDto,
      });

      console.log('[CartController], checkout, created order: ', order);

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { order },
      };
    } catch (error) {
      console.log('[CartController], checkout, error: ', error);
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }
}
