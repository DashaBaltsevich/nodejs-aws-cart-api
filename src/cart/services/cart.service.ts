import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { CartStatuses } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from '../../database/entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItemEntity } from '../../database/entities/cart-item.entity';
import { UpdateCartDto } from '../../database/updateCart.dto';
import { OrderEntity } from '../../database/entities/order.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private cartItemRepository: Repository<CartItemEntity>,

    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async findItemsByCartId(cart_id: string) {
    return await this.cartItemRepository.findBy({ cart_id });
  }

  async findByUserId(user_id: string) {
    return await this.cartRepository.findOneBy({ user_id });
  }

  async createByUserId(user_id: string) {
    try {
      const id = v4();
      const currentDate = new Date().toISOString();

      const userCart = this.cartRepository.create({
        id,
        user_id,
        created_at: currentDate,
        updated_at: currentDate,
        status: CartStatuses.OPEN,
        items: [],
      });

      console.log('new User Cart', JSON.stringify(userCart));

      const result = await this.cartRepository.save(userCart);

      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async findOrCreateByUserId(user_id: string) {
    try {
      const userCart = await this.cartRepository.findOneBy({ user_id });

      if (userCart) {
        console.log('user Cart exist', JSON.stringify(userCart));
        return userCart;
      }

      const res = await this.createByUserId(user_id);
      console.log('new user cart', res);

      return res;
    } catch (e) {
      console.log(e);
    }
  }

  async updateByUserId(userId: string, updateCartDto: UpdateCartDto) {
    const { items } = updateCartDto;
    console.log('items fron PUT cart req', items);
    try {
      const userCart = await this.findOrCreateByUserId(userId);

      if (!userCart) {
        throw new Error('No user Cart');
      }

      for (const item of items) {
        const cartItem = await this.cartItemRepository.findOne({
          where: { cart_id: userCart.id, product_id: item.product_id },
        });
        if (cartItem) {
          if (item.count === 0) {
            await this.cartItemRepository.delete(cartItem);
          }
          cartItem.count = item.count;
          cartItem.price = item.price;
          await this.cartItemRepository.save(cartItem);
        } else {
          if (item.count > 0) {
            const newCartItem = this.cartItemRepository.create({
              cart_id: userCart.id,
              product_id: item.product_id,
              count: item.count,
              price: item.price,
            });
            await this.cartItemRepository.save(newCartItem);
          }
        }
      }

      userCart.updated_at = new Date().toISOString();

      await this.cartRepository.save(userCart);
      return userCart;
    } catch (e) {
      console.log(e);
      throw new Error('Error updating cart');
    }
  }

  async removeByUserId(userId: string) {
    console.log('remove', userId);
    try {
      const userCart = await this.findByUserId(userId);
      if (!userCart) {
        throw Error('user not found');
      } else {
        await this.cartRepository.delete({ user_id: userId });
      }
    } catch (e) {
      console.log(e);
    }
  }

  // async checkout(userId: string, orderData) {
  //   const cart = await this.findByUserId(userId);

  //   if (!cart) {
  //     throw new Error('no cart');
  //   }

  //   const newOrder = this.orderRepository.create(orderData);

  //   return newOrder;
  // }
}
