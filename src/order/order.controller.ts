import { Controller, Get, HttpStatus, Req } from '@nestjs/common';
import { OrderService } from './services';
import { AppRequest, getOrderIdFromRequest } from '../shared';

@Controller('api/profile/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async findAll() {
    const orders = await this.orderService.findAll();

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: orders,
    };
  }
  
  @Get()
  async findByOrderId(@Req() req: AppRequest) {
    const order = await this.orderService.findById(getOrderIdFromRequest(req));
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order },
    };
  }
}
