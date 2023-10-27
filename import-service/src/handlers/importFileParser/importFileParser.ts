import { ReadableStream } from 'stream/web';
import { IProductWithStockList } from '@aws-practitioner/types';
import { getLambdaHandler } from '@aws-practitioner/utils';
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { S3Event } from 'aws-lambda';
import { SQS_URL } from '../../constants';
import { parseCSVFile } from '../../utils';

const _importFileParser = async (event: S3Event) => {
  const region = event.Records[0]?.awsRegion;
  const bucketName = event.Records[0]?.s3.bucket.name;
  const fileKey = event.Records[0]?.s3.object.key;

  const client = new S3Client({ region: region });
  const getCommand = new GetObjectCommand({ Bucket: bucketName, Key: fileKey });
  const webStream = (await client.send(getCommand)).Body?.transformToWebStream();
  const productsData = (await parseCSVFile(webStream as ReadableStream)) as IProductWithStockList;

  // move file to parsed/
  const copyCommand = new CopyObjectCommand({
    Bucket: bucketName,
    CopySource: `${bucketName}/${fileKey}`,
    Key: `parsed/${fileKey?.split('/')[1]}`,
  });

  const deleteCommand = new DeleteObjectCommand({ Bucket: bucketName, Key: fileKey });

  await client.send(copyCommand);
  await client.send(deleteCommand);

  // send data to SQS
  const sqsClient = new SQSClient({ region });

  productsData.forEach(product => {
    try {
      sqsClient.send(
        new SendMessageCommand({
          QueueUrl: SQS_URL,
          MessageBody: JSON.stringify(product),
        })
      );
    } catch (e) {
      console.log(`SQS sending error: ${e}`);
    }
  });

  return { statusCode: 200, data: null };
};

export const importFileParser = getLambdaHandler(_importFileParser);
