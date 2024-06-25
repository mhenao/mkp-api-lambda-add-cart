import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Context } from './interfaces';
import DbServerless from './database/dbServerless';
import config from './config';
import { addShoppingCart } from './domain/addShopingCart';
import { LoggerService } from './common/logger/logger.service';

const logger = new LoggerService();

export const handler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
  
  context.databaseCredentials = {
    host: config.host.trim(),
    database: config.database.trim(),
    username: config.user.trim(),
    password: config.password.trim(),
  };
  
  logger.log(JSON.stringify(event));
  
  const dbServerless = new DbServerless(logger, context);

  try {
    const rows = await addShoppingCart(dbServerless, event?.body);

    return {
      statusCode: rows?.statusCode,
      body: rows?.body,
    };
    
  } catch (error) {
    logger.error(`Error querying database: ${error}`);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error querying database', error }),
    };
  }
};


const event = {
  body: '{\r\n' +
  '  "shopping_cart": {\r\n' +
  '    "user_id": 1,\r\n' +
  '    "created_at": "2024-06-25T12:34:56.000Z",\r\n' +
  '    "updated_at": "2024-06-25T12:34:56.000Z"\r\n' +
  '  },\r\n' +
  '  "shopping_cart_items": [\r\n' +
  '    {\r\n' +
  '      "product_id": 101,\r\n' +
  '      "quantity": 2,\r\n' +
  '      "created_at": "2024-06-25T12:34:56.000Z",\r\n' +
  '      "updated_at": "2024-06-25T12:34:56.000Z"\r\n' +
  '    },\r\n' +
  '    {\r\n' +
  '      "product_id": 102,\r\n' +
  '      "quantity": 1,\r\n' +
  '      "created_at": "2024-06-25T12:34:56.000Z",\r\n' +
  '      "updated_at": "2024-06-25T12:34:56.000Z"\r\n' +
  '    }\r\n' +
  '  ]\r\n' +
  '}',
} as APIGatewayProxyEvent;
const context = {
    databaseCredentials: {
          host: config.host,
          database: config.database,
          username: config.user,
          password: config.password,
        },
};

handler(event, context).then((response) => {
  console.log(response);
});
