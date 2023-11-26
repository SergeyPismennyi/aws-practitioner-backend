import { getLambdaHandler } from '@aws-practitioner/utils';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { BUCKET_MANE, REGION } from '../../constants';

const _importProductsFile = async (event: APIGatewayProxyEvent) => {
  const { name = '' } = event.queryStringParameters || {};
  const fileName = decodeURIComponent(name);

  if (!/^[a-z0-9-_]+\.csv$/i.test(fileName)) {
    throw {
      statusCode: 400,
      data: { message: 'Invalid file name. File name should follows /^[a-z0-9-_]+\\.csv$/i pattern.' },
    };
  }

  const client = new S3Client({ region: REGION });
  const command = new PutObjectCommand({
    Bucket: BUCKET_MANE,
    Key: `uploaded/${fileName}`,
  });

  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 90,
  });

  return {
    statusCode: 200,
    data: signedUrl,
  };
};

export const importProductsFile = getLambdaHandler(_importProductsFile);
