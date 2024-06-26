import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Context } from './interfaces';
import { createConnection, getConnection, Connection  } from 'typeorm';
import DbServerless from './database/dbServerless';
import config from './config';
import { addShoppingCart } from './domain/addShopingCart';
import { LoggerService } from './common/logger/logger.service';

let connectionPromise: Promise<Connection> | null = null;

const logger = new LoggerService();


const ensureConnection = async (): Promise<Connection> => {
  if (!connectionPromise) {
    connectionPromise = createConnection().then(connection => {
      console.log('Connected to the database');
      return connection;
    }).catch(error => {
      console.error('Database connection failed', error);
      connectionPromise = null;
      throw error; // Re-throw the error to handle it downstream
    });
  }
  return connectionPromise;
};

export const handler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
  
  let conn: Connection;
  
  conn = await ensureConnection();
  
  context.databaseCredentials = {
    host: config.host.trim(),
    database: config.database.trim(),
    username: config.user.trim(),
    password: config.password.trim(),
  };
  
  logger.log(JSON.stringify(event));
  
  const { body } = event;

  try {
    const rows = await addShoppingCart(body, conn);

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
    
  } catch (error) {
    logger.error(`Error querying database: ${error} with params body: ${body}`);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error querying database', error }),
    };
  }
};


/*const event = {
  body: '{\r\n' +
  '  "user_id": 50,\r\n' +
  '  "items": [\r\n' +
  '    {\r\n' +
  '      "product_id": 200,\r\n' +
  '      "quantity": 20\r\n' +
  '    },\r\n' +
  '    {\r\n' +
  '      "product_id": 230,\r\n' +
  '      "quantity": 10\r\n' +
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
*/