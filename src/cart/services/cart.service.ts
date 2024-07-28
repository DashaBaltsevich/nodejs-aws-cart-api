import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { Cart, CartStatuses } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from '../../database/entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItemEntity } from '../../database/entities/cart-item.entity';
import { UpdateCartDto } from '../../database/updateCart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private cartItemRepository: Repository<CartItemEntity>,
  ) {}

  async findItemsByCartId(cart_id: string) {
    console.log('CartId', cart_id);
    return await this.cartItemRepository.findBy({ cart_id });
  }

  async findByUserId(user_id: string) {
    return await this.cartRepository.findOneBy({ user_id });
  }

  async createByUserId(user_id: string) {
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
  }

  async findOrCreateByUserId(user_id: string) {
    const userCart = await this.cartRepository.findOneBy({ user_id });

    if (userCart) {
      console.log('user Cart', JSON.stringify(userCart));
      return userCart;
    }

    const res = await this.createByUserId(user_id);
    console.log('res', res);

    return res;
  }

  async updateByUserId(userId: string, updateCartDto: UpdateCartDto) {
    const { items } = updateCartDto;
    const userCart = await this.findOrCreateByUserId(userId);

    if (!userCart) {
      throw new Error('No user Cart');
    }

    for (const item of items) {
      let cartItem = await this.cartItemRepository.findOne({
        where: {
          cart_id: userCart.id,
          product_id: item.product_id,
        },
      });

      if (cartItem) {
        cartItem.count = item.count;
      } else {
        cartItem = this.cartItemRepository.create({
          cart_id: userCart.id,
          product_id: item.product_id,
          count: item.count,
        });
      }
      await this.cartItemRepository.save(cartItem);
    }

    userCart.updated_at = new Date().toISOString();

    await this.cartRepository.save(userCart);
    return userCart;
  }

  async removeByUserId(userId: string) {
    console.log('remove', userId);

    const userCart = await this.findByUserId(userId);
    if (!userCart) {
      throw Error('user not found');
    } else {
      await this.cartRepository.delete({ user_id: userId });
    }
  }
}
