import { describe, expect, it, vi } from 'vitest';

import * as mockedProducts from '../../mock/products';
import { parseResponse } from '../../utils/response';
import { getProductsList } from './index';

describe('getProductsList', () => {
  it('should return a 404 response if products are not found', async () => {
    vi.spyOn(mockedProducts, 'getProducts').mockResolvedValueOnce(undefined);
    const response = await getProductsList();

    expect(response).toEqual(parseResponse(404, { message: 'products not found' }));
  });

  it('should return a 200 response with product data if products are found', async () => {
    const response = await getProductsList();

    expect(response).toEqual(parseResponse(200, mockedProducts.products));
  });
});
