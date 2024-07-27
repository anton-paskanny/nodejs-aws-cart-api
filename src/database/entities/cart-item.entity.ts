import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { CartEntity } from './cart.entity';

@Entity({ name: 'cart_items' })
export class CartItemEntity {
  @PrimaryColumn('uuid')
  cartId: string;

  @PrimaryColumn('uuid')
  productId: string;

  @Column({ type: 'int' })
  count: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  cart: CartEntity;
}
