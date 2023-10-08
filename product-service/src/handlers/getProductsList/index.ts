import { APIGatewayProxyHandler } from 'aws-lambda';
import { getProducts } from '../../mock/products';
import { parseResponse } from '../../utils/response';

export const getProductsList: APIGatewayProxyHandler = async () => {
  const products = await getProducts();

  return parseResponse(200, products);
};
