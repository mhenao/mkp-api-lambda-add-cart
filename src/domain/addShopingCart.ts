import { LoggerService } from "../common/logger/logger.service";
import { DbServerless, APIGatewayProxyEvent, ShoppingCart } from '../interfaces/'

const logger = new LoggerService();

export const addShoppingCart = async (dbServerless: DbServerless, body: string) => {
  
  console.log({
    body:  JSON.parse(body)
  });
  
  
  try {
    const { user_id, shopping_cart_items }: ShoppingCart = JSON.parse(body);

  
    const insertCartQuery = 'INSERT INTO shopping_carts (user_id) VALUES (?)';
    const cartResult = await dbServerless.execQuery(insertCartQuery, [user_id]);
    console.log(cartResult)
    const cartId = cartResult.insertId;

    for (const item of shopping_cart_items) {
      const insertItemQuery = 'INSERT INTO shopping_cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)';
      await dbServerless.execQuery(insertItemQuery, [cartId, item.product_id, item.quantity]);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Shopping cart and items added successfully', cartId }),
    };
  } catch (error) {
    logger.error(`Error adding shopping cart: ${error}`);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error adding shopping cart', error }),
    };
  }
};
