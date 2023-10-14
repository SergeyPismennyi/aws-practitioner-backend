import { IProductWithStock } from '@aws-practitioner/types';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { describe, expect, it, vi } from 'vitest';

import { getProductsById } from './getProductsById';
import { ProductWithStockTable } from '../../dynamo-db';
import { productsWithStock } from '../../mock/products';
import { parseResponse } from '../../utils';

describe('getProductsById', () => {
  it('should return a 400 response if productId is missing', async () => {
    const event = { pathParameters: {} };

    const response = await getProductsById(event as unknown as APIGatewayProxyEvent);
    expect(response).toEqual(parseResponse(400, { message: 'productId is a required field' }));
  });

  it('should return a 404 response if product is not found', async () => {
    const productId = 'someProductId';
    const event = { pathParameters: { id: productId } };
    const response = await getProductsById(event as unknown as APIGatewayProxyEvent);

    expect(response).toEqual(parseResponse(400, { message: 'productId must be a valid UUID' }));
  });

  it('should return a 200 response with product data if product is found', async () => {
    const productData = productsWithStock[0] as IProductWithStock;
    const event = { pathParameters: { id: productData?.id } };
    vi.spyOn(ProductWithStockTable, 'read').mockResolvedValueOnce(productData);
    const response = await getProductsById(event as unknown as APIGatewayProxyEvent);

    expect(response).toEqual(parseResponse(200, productData));
  });
});
