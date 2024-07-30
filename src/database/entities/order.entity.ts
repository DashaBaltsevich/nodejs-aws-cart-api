import { CartStatuses } from '../../cart/models';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartEntity } from './cart.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  cart_id: string;

  @Column('simple-json', { nullable: true })
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };

  @Column('simple-json')
  delivery: {
    type: string;
    address: any;
  };

  @Column('text', { nullable: true })
  comments: string;

  @Column({
    type: 'enum',
    enum: CartStatuses,
    default: CartStatuses.OPEN,
  })
  status: CartStatuses;

  @Column('int',{ nullable: true})
  total: number;

  // @ManyToOne(() => CartEntity, (cart) => cart.orders)
  // @JoinColumn({ name: 'cart_id' })
  // cart: CartEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToOne(() => CartEntity)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart: CartEntity;
}
