import { CartItemEntity } from '../../database/entities/cart-item.entity';
import { CartEntity } from '../../database/entities/cart.entity';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: CartItemEntity[]): number {
  return cart
    ? cart.reduce((acc: number, { price, count }: CartItemEntity) => {
        return (acc += price * count);
      }, 0)
    : 0;
}
