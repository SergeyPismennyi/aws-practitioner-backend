import { ICreateProductRequest } from '@aws-practitioner/types';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ProductWithStockTable } from '../../dynamo-db';
import { validateSchema, getLambdaHandler, parseBody } from '../../utils';
import { createProductValidationSchema } from '../../validation-schemas';

const _createProduct = async (event: APIGatewayProxyEvent) => {
  const { title, description, price, count } = parseBody(event.body || '') as ICreateProductRequest;

  validateSchema(400, createProductValidationSchema, { title, description, price, count });
  const id = await ProductWithStockTable.create({ title, description, price, count });

  return id ? { statusCode: 200, data: { id } } : null;
};

export const createProduct = getLambdaHandler(_createProduct);
