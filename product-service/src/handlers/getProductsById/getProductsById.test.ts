import { describe, expect, it } from 'vitest';

import * as mockedProducts from '../../mock/products';
import * as responseUtil from '../../utils/response';
import { getProductsById } from './index';

describe('getProductsById', () => {
  it('should return a 404 response if productId is missing', async () => {
    const event = { pathParameters: {} };

    const response = await getProductsById(event);
    expect(response).toEqual(responseUtil.parseResponse(404, { message: 'product id is missed' }));
  });

  it('should return a 404 response if product is not found', async () => {
    const productId = 'someProductId';
    const event = { pathParameters: { id: productId } };
    const response = await getProductsById(event);

    expect(response).toEqual(responseUtil.parseResponse(404, { message: 'product not found' }));
  });

  it('should return a 200 response with product data if product is found', async () => {
    const productData = mockedProducts.products[0];
    const event = { pathParameters: { id: productData?.id } };
    const response = await getProductsById(event);

    expect(response).toEqual(responseUtil.parseResponse(200, productData));
  });
});
