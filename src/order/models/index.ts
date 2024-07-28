// import { CartItem } from '../../cart/models';

import { CartStatuses } from '../../cart/models/index';

export type Order = {
  id?: string;
  userId: string;
  cartId: string;
  // items: CartItem[];
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };
  delivery: {
    type: string;
    address: string;
  };
  comments: string;
  status: CartStatuses;
  total: number;
};
