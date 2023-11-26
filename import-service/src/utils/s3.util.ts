import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export const s3GetObject = async (region: string, bucketName: string, objectKey: string) => {
  const s3Client = new S3Client({ region });

  return await s3Client.send(new GetObjectCommand({ Bucket: bucketName, Key: objectKey }));
};

export const s3MoveObject = async (region: string, bucketName: string, objectKey: string, newPath: string) => {
  const s3Client = new S3Client({ region });

  await s3Client.send(
    new CopyObjectCommand({ Bucket: bucketName, CopySource: `${bucketName}/${objectKey}`, Key: newPath })
  );
};

export const s3DeleteObject = async (region: string, bucketName: string, objectKey: string) => {
  const s3Client = new S3Client({ region });

  await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: objectKey }));
};
