import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SNS_TOPIC, REGION } from '../constants';

export const sendEmail = async ({
  message,
  subject,
  status,
}: {
  message: string;
  subject: string;
  status: 'error' | 'success';
}) => {
  const snsClient = new SNSClient({ region: REGION });
  const publishCommand = new PublishCommand({
    TopicArn: SNS_TOPIC,
    Subject: subject,
    Message: message,
    MessageAttributes: {
      status: {
        DataType: 'String',
        StringValue: status,
      },
    },
  });

  try {
    await snsClient.send(publishCommand);
  } catch (e) {
    console.log('Email send error: ', e);
  }
};

export const getCreateProductMessageTemplate = (status: 'error' | 'success', data: Array<Record<string, unknown>>) => {
  return {
    status,
    subject: `Product create ${status}!`,
    message:
      `The following products were ${status === 'success' ? '' : 'not'} created!\n\n` +
      `${data.map((item, index) => `${index}. ${JSON.stringify(item)}\n`)}`,
  };
};
