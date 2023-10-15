import { IStock } from './stock';

export type IProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type IProductList = Array<IProduct>;
export type IProductWithStock = IProduct & Omit<IStock, 'productId'>;
export type IProductWithStockList = Array<IProductWithStock>;

export type ICreateProductRequest = {
  title: string;
  description: string;
  price: number;
  count: number;
};
export type ICreateProductResponse = { id: string };
