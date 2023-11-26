import { IProduct, IStock } from '@aws-practitioner/types';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { describe, expect, it, vi } from 'vitest';
import { getProductsList } from './getProductsList';
import { ProductTable, StockTable } from '../../dynamo-db';
import { products, stockList, productsWithStock } from '../../mock/products';
import { parseResponse } from '../../utils';

describe('getProductsList', () => {
  it('should return 404 status code if products are not found', async () => {
    vi.spyOn(ProductTable, 'read').mockResolvedValueOnce(null);
    vi.spyOn(StockTable, 'read').mockResolvedValueOnce(null);
    const response = await getProductsList({} as APIGatewayProxyEvent);

    expect(response).toEqual(parseResponse(404, { message: 'Not found' }));
  });

  it('should return 200 status code with product data if products are found', async () => {
    vi.spyOn(ProductTable, 'read').mockResolvedValueOnce({
      items: products,
      count: products.length,
    } as unknown as IProduct);
    vi.spyOn(StockTable, 'read').mockResolvedValueOnce({
      items: stockList,
      count: products.length,
    } as unknown as IStock);
    const response = await getProductsList({} as APIGatewayProxyEvent);

    expect(response).toEqual(parseResponse(200, productsWithStock));
  });
});
