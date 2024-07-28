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

import { BasicAuthGuard, JwtAuthGuard } from '../auth';
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
          // total: calculateCartTotal(cart),
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
    const updateCartDto = plainToInstance(UpdateCartDto, body);
    console.log('dto', updateCartDto);
    const errors = await validate(updateCartDto);

    if (errors.length > 0) {
      throw new Error('Validation failed');
    }

    console.log(JSON.stringify(body));
    const cart = await this.cartService.updateByUserId(
      getUserIdFromRequest(req),
      updateCartDto,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        // total: calculateCartTotal(cart),
      },
    };
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(
    @Req() req: AppRequest,
    @Body() body,
    checkoutDto: CheckoutDto,
  ) {
    console.log('checkoutDto', checkoutDto);
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);
    const cartItems = await this.cartService.findItemsByCartId(cart.id);

    console.log('cartId', cart.id);
    console.log(cartItems, JSON.stringify(cartItems));

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode;

      return {
        statusCode,
        message: 'Cart is empty',
      };
    }

    const { id: cartId } = cart;
    // const total = calculateCartTotal(cart);
    const order = await this.orderService.create({
      ...checkoutDto,
      userId,
      cartId,
      status: CartStatuses.ORDERED,
      total: cartItems.length,
    });
    this.cartService.removeByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order },
    };
  }
}
