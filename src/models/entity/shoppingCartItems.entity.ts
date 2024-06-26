import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ShoppingCartItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  cart_id: number;

  @Column({ nullable: true })
  product_id: number;

  @Column()
  quantity: number;

/*  @ManyToOne(() => ShoppingCarts, cart => cart.items)
  shopping_carts: ShoppingCarts*/
  
  constructor() {
	this.id = 0;
	this.cart_id = 0;
	this.product_id = 0;
	this.quantity = 0;
  }
}
