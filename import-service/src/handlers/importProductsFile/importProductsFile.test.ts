import { parseResponse } from '@aws-practitioner/utils';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { describe, expect, it, vi } from 'vitest';
import { importProductsFile } from './importProductsFile';

const signedUrlMock = 'https://signed.url.mock';
const s3ClientInstance = {};
const putObjectCommandInstance = {};

const mocks = vi.hoisted(() => {
  return {
    S3Client: vi.fn().mockImplementation(() => s3ClientInstance),
    PutObjectCommand: vi.fn().mockImplementation(() => putObjectCommandInstance),
    getSignedUrl: vi.fn().mockImplementation(() => Promise.resolve(signedUrlMock)),
    BUCKET_MANE: 's3BucketName',
    REGION: 's3Region',
  };
});

vi.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: mocks.S3Client,
    PutObjectCommand: mocks.PutObjectCommand,
  };
});

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: mocks.getSignedUrl,
}));

vi.mock('../../constants', () => ({
  BUCKET_MANE: mocks.BUCKET_MANE,
  REGION: mocks.REGION,
}));

describe('getProductsById', () => {
  it('should return 400 status code if name query param is missed', async () => {
    const event = { queryStringParameters: {} };
    const response = await importProductsFile(event as unknown as APIGatewayProxyEvent);
    const expectedMessage = 'Invalid file name. File name should follows /^[a-z0-9-_]+\\.csv$/i pattern.';

    expect(response).toEqual(parseResponse(400, { message: expectedMessage }));
  });

  it('should return 400 status code if name param is not follows regexp pattern', async () => {
    const event = { queryStringParameters: { name: 'some_file_name.pdf' } };
    const response = await importProductsFile(event as unknown as APIGatewayProxyEvent);
    const expectedMessage = 'Invalid file name. File name should follows /^[a-z0-9-_]+\\.csv$/i pattern.';

    expect(response).toEqual(parseResponse(400, { message: expectedMessage }));
  });

  it('should return signed URL', async () => {
    const fileNameMock = 'some_file_name.csv';
    const event = { queryStringParameters: { name: fileNameMock } };
    const response = await importProductsFile(event as unknown as APIGatewayProxyEvent);

    expect(mocks.S3Client).toHaveBeenCalledWith({ region: mocks.REGION });
    expect(mocks.PutObjectCommand).toHaveBeenCalledWith({ Bucket: mocks.BUCKET_MANE, Key: `uploaded/${fileNameMock}` });
    expect(mocks.getSignedUrl).toHaveBeenCalledWith(s3ClientInstance, putObjectCommandInstance, { expiresIn: 90 });
    expect(response).toEqual(parseResponse(200, signedUrlMock));
  });
});
