import { LoggerService } from './logger/logger.service';
import ServerlessManagerMysql from "serverless-manager-mysql";
import config from '../config';

class DbServerless {
  BD_HOST = config.host;
  BD_DATABASE = config.database;
  BD_USER = config.user;
  BD_PASS = config.password;
  logger: LoggerService;

  constructor(logger: any, context: any) {
    const {
      databaseCredentials: { host, database, username, password },
    } = context;
    this.logger = logger;
    this.BD_HOST = host
    this.BD_DATABASE = database
    this.BD_USER = username
    this.BD_PASS = password
  }

  async execQuery(query: string, params?: any) {
    const connPool = new ServerlessManagerMysql(
      {
        host: this.BD_HOST,
        database: this.BD_DATABASE,
        user: this.BD_USER,
        password: this.BD_PASS,
        port: 3306,
        connectionLimit: 50,
        connectTimeout: 30000,
        acquireTimeout: 30000,
        waitForConnections: true,
        queueLimit: 50,
      },
      {
        maxKeepAliveConnPerPool: 2,
        maxRetries: 30,
        retryDelay: 10000,
        killZombies: false,
        debug: false,
      },
    );
    try {
      const results = await connPool.query(query, params);
      return JSON.parse(JSON.stringify(results[0]));
    } catch (error) {
      this.logger.error(`[execQuery] Error: ${error}`);
      throw error;
    } finally {
      await connPool?.end();
    }
  }
}

export default DbServerless