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
} from '@nestjs/common';

import { BasicAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { UpdateCartDto } from '../database/updateCart.dto';
import { CheckoutDto } from '../database/checkout.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CartStatuses } from './models';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    try {
      console.log('req', req);
      const cart = await this.cartService.findOrCreateByUserId(
        getUserIdFromRequest(req),
      );

      console.log('getUserIdFromRequest', getUserIdFromRequest(req));
      console.log('cart', cart);

      const cartItems = await this.cartService.findItemsByCartId(cart.id);

      console.log('result', JSON.stringify(cart) + JSON.stringify(cartItems));
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
          cart: {
            ...cart,
            items: cartItems,
          },
          total: calculateCartTotal(cartItems),
        },
      };
    } catch (e) {
      console.log(e);
    }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) {
    try {
      const updateCartDto = plainToInstance(UpdateCartDto, body);
      console.log('dto', updateCartDto);
      const errors = await validate(updateCartDto);

      if (errors.length > 0) {
        console.log('error', errors);
        throw new Error('Validation failed');
      }

      const userId = getUserIdFromRequest(req);
      console.log(
        'userId from getUserIdFromRequest in file cart controller',
        userId,
      );

      console.log(JSON.stringify(body));
      const cart = await this.cartService.updateByUserId(
        getUserIdFromRequest(req),
        updateCartDto,
      );

      const cartItems = await this.cartService.findItemsByCartId(cart.id);

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
          cart,
          total: calculateCartTotal(cartItems),
        },
      };
    } catch (e) {
      console.log(e);
    }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest) {
    try {
      await this.cartService.removeByUserId(getUserIdFromRequest(req));

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
      };
    } catch (e) {
      console.log(e);
    }
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body) {
    try {
      const checkoutDto = plainToInstance(CheckoutDto, body);
      const errors = await validate(checkoutDto);
      if (errors.length > 0) {
        console.log('valid err', errors);
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          errors: errors.map((err) => err.toString()),
        };
      }
      console.log('checkoutDto', checkoutDto);
      const userId = getUserIdFromRequest(req);
      const cart = await this.cartService.findByUserId(userId);
      const cartItems = await this.cartService.findItemsByCartId(cart.id);

      console.log('cartId', cart.id);
      console.log(cartItems, JSON.stringify(cartItems));

      if (!cart) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Cart not found',
        };
      }

      if (!cartItems || cartItems.length === 0) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Cart is empty',
        };
      }

      // const { id: cartId } = cart;
      const total = calculateCartTotal(cartItems);
      const order = await this.orderService.create({
        ...checkoutDto,
        user_id: userId,
        cart_id: cart.id,
        total,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { order },
      };
    } catch (e) {
      console.log(e);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Custom Internal server error',
      };
    }
  }
}
