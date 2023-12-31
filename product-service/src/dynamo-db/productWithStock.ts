import { randomUUID } from 'crypto';
import { IProductWithStock, Optional } from '@aws-practitioner/types';
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb';
import { DynamoDB } from './dynamoDB';
import { PRODUCT_TABLE, STOCK_TABLE } from '../constants';

class ProductWithStock extends DynamoDB {
  constructor() {
    super('');
  }

  async create({ id, count, price, title, description }: Optional<IProductWithStock, 'id'>) {
    const _id = id || randomUUID();

    await this.transactWrite([
      { Put: { TableName: PRODUCT_TABLE, Item: marshall({ id: _id, price, title, description }) } },
      { Put: { TableName: STOCK_TABLE, Item: marshall({ product_id: _id, count }) } },
    ]);

    return id;
  }

  async read(id: string): Promise<IProductWithStock | null> {
    const response = await this.transactGet([
      { Get: { TableName: PRODUCT_TABLE, Key: marshall({ id }) } },
      { Get: { TableName: STOCK_TABLE, Key: marshall({ product_id: id }) } },
    ]);

    const product = response?.Responses?.[0]?.Item;
    const stock = response?.Responses?.[1]?.Item;

    if (product && stock) {
      delete stock.product_id;
      return this.camelizeResponse(unmarshall({ ...product, ...stock })) as IProductWithStock;
    } else {
      return null;
    }
  }

  async update({ id, count, price, title, description = '' }: IProductWithStock) {
    await this.transactWrite([
      {
        Update: {
          TableName: PRODUCT_TABLE,
          Key: marshall({ id }),
          ...this.getExpression({ title, description, price }, true),
        },
      },
      {
        Update: {
          TableName: STOCK_TABLE,
          Key: marshall({ product_id: id }),
          ...this.getExpression({ count }, true),
        },
      },
    ]);

    return true;
  }

  async delete(id: string) {
    await this.transactWrite([
      { Delete: { TableName: PRODUCT_TABLE, Key: marshall({ id }) } },
      { Delete: { TableName: STOCK_TABLE, Key: marshall({ product_id: id }) } },
    ]);

    return true;
  }
}

export default new ProductWithStock();
