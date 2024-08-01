import { CartItem, CartStatuses } from 'src/cart';

export type OrderType = {
  id?: string;
  userId: string;
  cartId: string;
  items: CartItem[];
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };
  delivery: {
    type: string;
    address: any;
  };
  comments: string;
  status: CartStatuses;
  total: number;
};
