import { generateProducts, Product } from '../mocks/generateProducts';
import { ProductSearchParams, CartSyncPayload, CheckoutPayload, Order } from './shop.types';
import { logger } from '../../../shared/logging/logger';

let MOCK_PRODUCTS: Product[] | null = null;

function getMockProducts(): Product[] {
  if (!MOCK_PRODUCTS) {
    MOCK_PRODUCTS = generateProducts(20000);
  }
  return MOCK_PRODUCTS;
}

function simulateNetworkDelay(min = 200, max = 700): Promise<void> {
  const delay = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function simulateRandomFailure(failureRate = 0.05): void {
  if (Math.random() < failureRate) {
    throw { response: { status: 500 }, message: 'Simulated server error' };
  }
}

function sortProducts(products: Product[], sortBy?: ProductSearchParams['sortBy']): Product[] {
  const sorted = [...products];
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => b.imageSeed - a.imageSeed);
    default:
      return sorted;
  }
}

export const shopApi = {
  async searchProducts(params: ProductSearchParams): Promise<{ items: Product[]; hasMore: boolean; totalCount: number }> {
    await simulateNetworkDelay();
    simulateRandomFailure();

    let results = getMockProducts();

    if (params.query) {
      const q = params.query.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (params.categories?.length) {
      const catSet = new Set(params.categories);
      results = results.filter((p) => catSet.has(p.category));
    }
    if (params.minPrice != null) {
      results = results.filter((p) => p.price >= params.minPrice!);
    }
    if (params.maxPrice != null) {
      results = results.filter((p) => p.price <= params.maxPrice!);
    }
    if (params.minRating != null) {
      results = results.filter((p) => p.rating >= params.minRating!);
    }
    if (params.inStockOnly) {
      results = results.filter((p) => p.inStock);
    }

    results = sortProducts(results, params.sortBy);

    const start = params.page * params.pageSize;
    const end = start + params.pageSize;
    const items = results.slice(start, end);

    logger.debug(`searchProducts: page ${params.page}, ${items.length}/${results.length} returned`);

    return { items, hasMore: end < results.length, totalCount: results.length };
  },

  async getProductById(productId: string): Promise<Product | null> {
    await simulateNetworkDelay();
    return getMockProducts().find((p) => p.id === productId) ?? null;
  },

  async getProductsByIds(productIds: string[]): Promise<Product[]> {
    await simulateNetworkDelay();
    const idSet = new Set(productIds);
    return getMockProducts().filter((p) => idSet.has(p.id));
  },

  async syncCart(payload: CartSyncPayload): Promise<{ synced: boolean }> {
    await simulateNetworkDelay();
    simulateRandomFailure(0.05);
    logger.debug(`Cart synced: ${payload.items.length} items`);
    return { synced: true };
  },

  async checkout(payload: CheckoutPayload): Promise<Order> {
    await simulateNetworkDelay(400, 1200);
    simulateRandomFailure(0.1);

    const total = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      id: `order_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      items: payload.items,
      total: Math.round(total * 100) / 100,
      status: 'PLACED',
      createdAt: new Date().toISOString(),
    };
  },
};