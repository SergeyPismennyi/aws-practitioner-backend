import { APIGatewayProxyResult } from 'aws-lambda';

export const parseResponse = (statusCode: number, response: unknown): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  },
  body: typeof response === 'string' ? response : JSON.stringify(response),
});
