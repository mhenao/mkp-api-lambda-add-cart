"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const typeorm_1 = require("typeorm");
const config_1 = __importDefault(require("./config"));
const addShoppingCart_1 = require("./domain/addShoppingCart");
const logger_service_1 = require("./common/logger/logger.service");
let connectionPromise = null;
const logger = new logger_service_1.LoggerService();
const ensureConnection = async () => {
    if (!connectionPromise) {
        connectionPromise = (0, typeorm_1.createConnection)().then(connection => {
            console.log('Connected to the database');
            return connection;
        }).catch(error => {
            console.error('Database connection failed', error);
            connectionPromise = null;
            throw error;
        });
    }
    return connectionPromise;
};
const handler = async (event, context) => {
    let conn;
    conn = await ensureConnection();
    console.log({
        eventParams: event,
    });
    logger.log(JSON.stringify(event));
    const { body } = event;
    try {
        const rows = await (0, addShoppingCart_1.addShoppingCart)(body, conn);
        return {
            statusCode: 200,
            body: JSON.stringify(rows),
        };
    }
    catch (error) {
        logger.error(`Error querying database: ${error} with params body: ${body}`);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error querying database', error }),
        };
    }
    finally {
        if (conn) {
            await conn.close();
        }
    }
};
exports.handler = handler;
const event = {
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
};
const context = {
    databaseCredentials: {
        host: config_1.default.host,
        database: config_1.default.database,
        username: config_1.default.user,
        password: config_1.default.password,
    },
};
(0, exports.handler)(event, context).then((response) => {
    console.log(response);
});
//# sourceMappingURL=handler.js.map