import { Product } from '../mocks/generateProducts';

export interface ProductSearchParams {
  query?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page: number;
  pageSize: number;
}

export interface CartSyncPayload {
  items: { productId: string; quantity: number }[];
}

export interface CheckoutPayload {
  items: { productId: string; quantity: number; price: number }[];
  addressId: string;
}

export interface Order {
  id: string;
  items: CheckoutPayload['items'];
  total: number;
  status: 'PLACED' | 'FAILED';
  createdAt: string;
}

export type { Product };