import { CartStatuses } from 'src/cart';

export type OrderType = {
  id?: string;
  userId: string;
  cartId: string;
  payment: {
    type: string;
  };
  delivery: {
    type: string;
    address: string;
  };
  comments: string;
  status: CartStatuses;
  total: number;
};
