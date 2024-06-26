import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ShoppingCartItems } from './shoppingCartItems.entity';

@Entity()
export class ShoppingCarts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: string;

/*  @OneToMany(() => ShoppingCartItems, item => item.shopping_carts)
  items!: ShoppingCartItems[];*/

  constructor() {
	this.id = 0;
	this.user_id = 0;
	this.created_at = '';
	this.updated_at = '';
  }
}
