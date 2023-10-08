import { APIGatewayProxyEvent } from 'aws-lambda';
import { getProducts } from '../../mock/products';
import { parseResponse } from '../../utils/response';

export const getProductsById = async (event: Pick<APIGatewayProxyEvent, 'pathParameters'>) => {
  const productId = event.pathParameters?.id;

  if (!productId) {
    return parseResponse(404, { message: 'product id is missed' });
  }

  const product = await getProducts(productId);
  return product ? parseResponse(200, product) : parseResponse(404, { message: 'product not found' });
};
