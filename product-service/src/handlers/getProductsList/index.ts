import { getProducts } from '../../mock/products';
import { parseResponse } from '../../utils/response';

export const getProductsList = async () => {
  const products = await getProducts();

  return products ? parseResponse(200, products) : parseResponse(404, { message: 'products not found' });
};
