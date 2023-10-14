import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

import { ObjectSchema } from 'yup';

export const parseResponse = (statusCode: number, response: unknown): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  },
  body: typeof response === 'string' ? response : JSON.stringify(response),
});

export const validateSchema = (
  code: number,
  schema: ObjectSchema<Record<string, unknown>>,
  obj: Record<string, unknown>
) => {
  try {
    schema.validateSync(obj);
  } catch (error) {
    const { message } = error as Record<string, unknown>;
    throw { statusCode: code, data: { message } };
  }
};

export const getLambdaHandler =
  (handler: (event: APIGatewayProxyEvent) => Promise<{ statusCode: number; data: unknown } | null>) =>
  async (event: APIGatewayProxyEvent) => {
    try {
      const res = await handler(event);

      return res ? parseResponse(res.statusCode, res.data) : parseResponse(404, { message: 'Not found' });
    } catch (error) {
      const { statusCode = 500, data = { message: 'Internal server error' } } = error as {
        statusCode: number;
        data: unknown;
      };

      return parseResponse(statusCode, data);
    }
  };
