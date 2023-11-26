import { APIGatewayProxyEvent } from 'aws-lambda';
import { ProductWithStockTable } from '../../dynamo-db';
import { validateSchema, getLambdaHandler } from '../../utils';
import { productIdValidationSchema } from '../../validation-schemas';

const _getProductsById = async (event: APIGatewayProxyEvent) => {
  const productId = event.pathParameters?.id || '';

  validateSchema(400, productIdValidationSchema, { productId });
  const product = await ProductWithStockTable.read(productId);

  return product ? { statusCode: 200, data: product } : null;
};

export const getProductsById = getLambdaHandler(_getProductsById);
