import { IProductList, IProductWithStockList, IStockList } from '@aws-practitioner/types';

export const products: IProductList = [
  {
    description: 'Short Product Description1',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
    price: 24,
    title: 'ProductOne',
  },
  {
    description: 'Short Product Description7',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
    price: 15,
    title: 'ProductTitle',
  },
];

export const productsWithStock: IProductWithStockList = [
  {
    description: 'Short Product Description1',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
    price: 24,
    title: 'ProductOne',
    count: 1,
  },
  {
    description: 'Short Product Description7',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
    price: 15,
    title: 'ProductTitle',
    count: 2,
  },
];

export const stockList: IStockList = [
  {
    productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
    count: 1,
  },
  {
    productId: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
    count: 2,
  },
];
