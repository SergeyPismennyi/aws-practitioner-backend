import { APIGatewayProxyResult } from 'aws-lambda';

export const parseResponse = (statusCode: number, response: unknown): APIGatewayProxyResult => ({
  statusCode,
  body: typeof response === 'string' ? response : JSON.stringify(response),
});
