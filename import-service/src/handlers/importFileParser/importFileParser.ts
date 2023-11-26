import { ReadableStream } from 'stream/web';
import { IProductWithStockList } from '@aws-practitioner/types';
import { getLambdaHandler } from '@aws-practitioner/utils';
import { S3Event } from 'aws-lambda';
import { SQS_URL } from '../../constants';
import { parseCSVFile, s3DeleteObject, s3GetObject, s3MoveObject, sqsSendMessage } from '../../utils';

const _importFileParser = async (event: S3Event) => {
  const region = event.Records[0]?.awsRegion as string;
  const bucketName = event.Records[0]?.s3.bucket.name as string;
  const objectKey = event.Records[0]?.s3.object.key as string;

  const webStream = (await s3GetObject(region, bucketName, objectKey)).Body?.transformToWebStream();
  const products = (await parseCSVFile(webStream as ReadableStream)) as IProductWithStockList;

  await s3MoveObject(region, bucketName, objectKey, `parsed/${objectKey?.split('/')[1]}`);
  await s3DeleteObject(region, bucketName, objectKey);

  for await (const product of products) {
    await sqsSendMessage(SQS_URL, JSON.stringify(product));
  }

  return { statusCode: 200, data: null };
};

export const importFileParser = getLambdaHandler(_importFileParser);
