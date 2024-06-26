import { APIGatewayProxyResult } from 'aws-lambda';
import { Context } from './interfaces';
export declare const handler: (event: any, context: Context) => Promise<APIGatewayProxyResult>;
