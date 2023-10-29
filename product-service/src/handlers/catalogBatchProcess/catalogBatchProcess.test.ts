import { IProductWithStock } from '@aws-practitioner/types';
import { parseResponse } from '@aws-practitioner/utils';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { catalogBatchProcess } from './catalogBatchProcess';
import { getCreateProductMessageTemplate } from '../../utils';

const mocks = vi.hoisted(() => {
  return {
    ProductWithStockTable: { create: vi.fn().mockImplementation(() => Promise.resolve()) },
    sendEmail: vi.fn().mockImplementation(() => Promise.resolve()),
  };
});

vi.mock('../../dynamo-db', () => {
  return {
    ProductWithStockTable: mocks.ProductWithStockTable,
  };
});

vi.mock('../../utils', async () => {
  const actual = (await vi.importActual('../../utils')) as Record<string, unknown>;

  return {
    ...actual,
    sendEmail: mocks.sendEmail,
  };
});

const getMockSQSEvent = (records: Array<Record<string, unknown>>): SQSEvent => ({
  Records: records as unknown as Array<SQSRecord>,
});

const validRecord: IProductWithStock = {
  id: 'testId',
  title: 'testTitle',
  description: 'testDescription',
  price: 100,
  count: 10,
};

const invalidRecord = { ...validRecord, price: null };

describe('catalogBatchProcess', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should create product and send success email', async () => {
    const event = getMockSQSEvent([{ body: JSON.stringify(validRecord) }]);
    const response = await catalogBatchProcess(event);

    expect(response).toEqual(parseResponse(200, null));
    expect(mocks.ProductWithStockTable.create).toHaveBeenCalledWith(validRecord);
    expect(mocks.sendEmail).toHaveBeenCalledWith({ ...getCreateProductMessageTemplate('success', [validRecord]) });
  });

  it('should should not create product and error email', async () => {
    const event = getMockSQSEvent([{ body: JSON.stringify(invalidRecord) }]);
    const response = await catalogBatchProcess(event);

    expect(response).toEqual(parseResponse(200, null));
    expect(mocks.ProductWithStockTable.create).not.toHaveBeenCalledWith();
    expect(mocks.sendEmail).toHaveBeenCalledWith({ ...getCreateProductMessageTemplate('error', [invalidRecord]) });
  });

  it('should create product and send success and error emails', async () => {
    const event = getMockSQSEvent([{ body: JSON.stringify(validRecord) }, { body: JSON.stringify(invalidRecord) }]);
    const response = await catalogBatchProcess(event);

    expect(response).toEqual(parseResponse(200, null));
    expect(mocks.ProductWithStockTable.create).toHaveBeenCalledOnce();
    expect(mocks.ProductWithStockTable.create).toHaveBeenCalledWith(validRecord);
    expect(mocks.sendEmail).toHaveBeenCalledWith({ ...getCreateProductMessageTemplate('success', [validRecord]) });
    expect(mocks.sendEmail).toHaveBeenCalledWith({ ...getCreateProductMessageTemplate('error', [invalidRecord]) });
  });
});
