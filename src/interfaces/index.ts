import { LoggerService } from '../common/logger/logger.service';

export interface Product {
	id?: number;
	sku_id?: string;
	name?: string;
	description?: string;
	price?: number;
	category?: string;
	stock_quantity?: number;
	security_stock_quantity?: number;
	current_stock_quantity?: number;
	provider_id?: number;
	warehouse_id?: number;
	created_at?: Date;
	updated_at?: Date;
  }
  
  export interface APIGatewayProxyEvent {
	body: string | null;
}
  
  export interface APIGatewayProxyResult {	
	statusCode: number;
	body: string;
  }
  
  export interface Context {
	databaseCredentials: {
	  host: string;
	  database: string;
	  username: string;
	  password: string;
  }
}

export interface DbServerless {
	BD_HOST: string;
	BD_DATABASE: string;
	BD_USER: string;
	BD_PASS: string;
	logger: LoggerService;
	execQuery(query: string, params?: any): Promise<any>;
}

export interface ShoppingCartItem {
	product_id: number;
	quantity: number;
  }
  
  export interface ShoppingCart {
	user_id?: number;
	shopping_cart_items: ShoppingCartItem[];
  }
  