import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CartEntity } from './cart.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'cart_items' })
export class CartItemEntity {
  @PrimaryColumn('uuid')
  cart_id: string;

  @PrimaryColumn('uuid')
  product_id: string;

  @Column({ type: 'int' })
  count: number;

  // @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  // @JoinColumn({ name: 'product_id' })
  // product: ProductEntity;

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart: CartEntity;

  // @ManyToOne(() => OrderEntity, (order) => order.items)
  // order: OrderEntity;
}
