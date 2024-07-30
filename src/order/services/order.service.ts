import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { OrderEntity } from '../../database/entities/order.entity';
import { CartEntity } from '../../database/entities/cart.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CartStatuses } from '../../cart/models/index';
import { CartService } from '../../cart/services/cart.service';
import { CartItemEntity } from '../../database/entities/cart-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    @InjectDataSource() private readonly dataSource: DataSource,
    private cartService: CartService,

    @InjectRepository(CartItemEntity)
    private cartItemRepository: Repository<CartItemEntity>,
  ) {}

  async findAll() {
    return this.orderRepository.find({
      relations: {
        cart: { items: true },
      },
    });
  }
  async findById(orderId: string) {
    return await this.orderRepository.findOneBy({ id: orderId });
  }

  async create(data) {
    const id = v4();
    const newOrder = this.orderRepository.create({
      id,
      user_id: data.user_id,
      cart_id: data.cart_id,
      payment: {
        type: data.payment.type,
        address: data.payment.address,
        creditCard: data.payment.creditCard,
      },
      delivery: {
        type: data.delivery.type,
        address: data.delivery.address,
      },
      comments: data.comments,
      status: CartStatuses.ORDERED,
      total: data.total,
    });

    console.log('data source from checkout', this.dataSource);
    const order = await this.dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.save(OrderEntity, newOrder);
        const cart = await this.cartService.findByUserId(data.userId);
        if (!cart) {
          console.log('Cart not found for user from checkout');
        }
        cart.status = CartStatuses.ORDERED;
        console.log('cart from checkout', cart);
        await transactionalEntityManager.save(CartEntity, cart);
        const cartItems = await this.cartService.findItemsByCartId(cart.id);
        console.log('cartItems from checkout', cartItems);
        await this.cartItemRepository.delete({ cart_id: cart.id });
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

    const newOrder = { ...order, ...data };

    // const newOrder = this.orderRepository.create({
    //   id: orderId,
    //   ...data,
    // });
    // await this.orderRepository.save(newOrder);

    await this.orderRepository.update(orderId, newOrder);

    return newOrder;
  }
}
