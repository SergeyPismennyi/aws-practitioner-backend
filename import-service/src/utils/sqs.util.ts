import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({});

export const sqsSendMessage = async (sqsUrl: string, message: string, delay = 5) => {
  try {
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: sqsUrl,
        MessageBody: message,
        DelaySeconds: delay,
      })
    );
  } catch (e) {
    console.log(`SQS sending error: ${e}`);
  }
};
