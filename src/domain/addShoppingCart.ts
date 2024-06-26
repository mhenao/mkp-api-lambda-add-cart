import { getConnection, Repository, QueryRunner } from 'typeorm';
import { ShoppingCarts } from '../models/entity/shoppingCarts.entity';
import { ShoppingCartItems } from '../models/entity/shoppingCartItems.entity';

export const addShoppingCart = async (input: string, connection: any) => {
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { user_id, items } = JSON.parse(input);

    const shoppingCartRepository: Repository<ShoppingCarts> = queryRunner.manager.getRepository(ShoppingCarts);
    const shoppingCartItemRepository: Repository<ShoppingCartItems> = queryRunner.manager.getRepository(ShoppingCartItems);

    const cart = new ShoppingCarts();
    cart.user_id = user_id;
    cart.created_at = new Date().toISOString();
    cart.updated_at = new Date().toISOString();

    const savedCart = await shoppingCartRepository.save(cart);

    const itemsParams = items.map((item: { product_id: number; quantity: number }) => {
      const cartItem = new ShoppingCartItems();
      cartItem.cart_id = savedCart.id;
      cartItem.product_id = item.product_id;
      cartItem.quantity = item.quantity;
      return cartItem;
    });

    await shoppingCartItemRepository.save(itemsParams);

    await queryRunner.commitTransaction();

    return savedCart;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error(`Error adding shopping cart:, ${error} with params ${input}`);
    throw error;
  } finally {
    await queryRunner.release();
  }
};
