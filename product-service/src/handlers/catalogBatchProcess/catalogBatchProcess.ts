import { getLambdaHandler, softValidateSchema } from '@aws-practitioner/utils';
import { SQSEvent } from 'aws-lambda';
import { ProductWithStockTable } from '../../dynamo-db';
import { sendEmail, getCreateProductMessageTemplate } from '../../utils';
import { createProductValidationSchema } from '../../validation-schemas';

const _catalogBatchProcess = async (event: SQSEvent) => {
  const validatedRecords = event.Records.map(({ body }) => JSON.parse(body)).map(productRecord => {
    const isValid = softValidateSchema(createProductValidationSchema, productRecord);

    return { isValid, data: productRecord };
  });

  const validRecords = validatedRecords.filter(({ isValid }) => isValid).map(({ data }) => data);
  const invalidRecords = validatedRecords.filter(({ isValid }) => !isValid).map(({ data }) => data);

  for await (const record of validRecords) {
    await ProductWithStockTable.create(record);
  }

  if (validRecords.length) {
    await sendEmail({ ...getCreateProductMessageTemplate('success', validRecords) });
  }

  if (invalidRecords.length) {
    await sendEmail({ ...getCreateProductMessageTemplate('error', invalidRecords) });
  }

  return { statusCode: 200, data: null };
};

export const catalogBatchProcess = getLambdaHandler(_catalogBatchProcess);
