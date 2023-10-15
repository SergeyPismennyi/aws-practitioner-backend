import { randomUUID } from 'crypto';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { describe, expect, it, vi } from 'vitest';
import { createProduct } from './createProduct';
import { ProductWithStockTable } from '../../dynamo-db';
import { parseResponse } from '../../utils';

const productId = randomUUID();
const getEvent = (obj: Record<string, unknown>) => ({ body: JSON.stringify(obj) } as unknown as APIGatewayProxyEvent);

describe('getProductsById', () => {
  it('should return 400 status code if required param is missed', async () => {
    let expectedError =
      'title is a required field, description is a required field, price is a required field, count is a required field';
    let response = await createProduct(getEvent({}));
    expect(response).toEqual(parseResponse(400, { message: expectedError }));

    expectedError = 'description is a required field, price is a required field, count is a required field';
    response = await createProduct(getEvent({ title: 'title' }));
    expect(response).toEqual(parseResponse(400, { message: expectedError }));

    expectedError = 'price is a required field, count is a required field';
    response = await createProduct(getEvent({ title: 'title', description: 'description' }));
    expect(response).toEqual(parseResponse(400, { message: expectedError }));

    expectedError = 'count is a required field';
    response = await createProduct(getEvent({ title: 'title', description: 'description', price: 10 }));
    expect(response).toEqual(parseResponse(400, { message: expectedError }));
  });

  it('should return 200 status code if product was created', async () => {
    vi.spyOn(ProductWithStockTable, 'create').mockResolvedValueOnce(productId);
    const response = await createProduct(
      getEvent({ title: 'title', description: 'description', price: 10, count: 10 })
    );
    expect(response).toEqual(parseResponse(200, { id: productId }));
  });

  it('should return 500 status code', async () => {
    vi.spyOn(ProductWithStockTable, 'create').mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await createProduct(
      getEvent({ title: 'title', description: 'description', price: 10, count: 10 })
    );
    expect(response).toEqual(parseResponse(500, { message: 'Internal server error' }));
  });
});
