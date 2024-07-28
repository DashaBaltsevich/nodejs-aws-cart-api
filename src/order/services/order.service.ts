import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { OrderEntity } from '../../database/entities/order.entity';
import { CartEntity } from '../../database/entities/cart.entity';
import { Order } from '../models';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CartStatuses } from '../../cart/models/index';
import { CartService } from '../../cart/services/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    @InjectDataSource() private readonly dataSource: DataSource,
    private cartService: CartService,
  ) {}

  async findById(orderId: string) {
    return await this.orderRepository.findOneBy({ id: orderId });
  }

  async create(data: Order) {
    const id = v4();
    const newOrder = this.orderRepository.create({
      id,
      user_id: data.userId,
      cart_id: data.cartId,
      // items: data.items,
      payment: data.payment,
      delivery: data.delivery,
      comments: data.comments,
      status: data.status as CartStatuses,
      total: data.total,
    });

    console.log('data source', this.dataSource);
    const order = await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.save(OrderEntity, newOrder);
        const cart = await this.cartService.findByUserId(data.userId);
        cart.status = CartStatuses.ORDERED;
        await transactionalEntityManager.save(CartEntity, cart);
        const cartItems = await this.cartService.findItemsByCartId(cart.id);
        return { ...newOrder, items: cartItems };
      },
    );
    console.log('order', order);
    return order;
  }

  async update(orderId: string, data: any) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    const newOrder = this.orderRepository.create({
      id: orderId,
      ...data,
    });
    await this.orderRepository.save(newOrder);
  }
}
