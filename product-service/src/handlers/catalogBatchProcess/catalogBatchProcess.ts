import { getLambdaHandler, softValidateSchema } from '@aws-practitioner/utils';
import { SQSEvent } from 'aws-lambda';
import { ProductWithStockTable } from '../../dynamo-db';
import { createProductValidationSchema } from '../../validation-schemas';

const _catalogBatchProcess = async (event: SQSEvent) => {
  console.log('event: ', event);

  const validatedRecords = event.Records.map(({ body }) => JSON.parse(body)).map(productRecord => {
    const isValid = softValidateSchema(createProductValidationSchema, productRecord);

    return { isValid, data: productRecord };
  });

  const validRecords = validatedRecords.filter(({ isValid }) => isValid).map(({ data }) => data);
  const invalidRecords = validatedRecords.filter(({ isValid }) => !isValid).map(({ data }) => data);

  console.log('valid records: ', validRecords);
  console.log('invalid records: ', invalidRecords);

  for await (const record of validRecords) {
    await ProductWithStockTable.create(record);
  }

  return { statusCode: 200, data: null };
};

export const catalogBatchProcess = getLambdaHandler(_catalogBatchProcess);
