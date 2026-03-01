import { describe, it, expect } from 'vitest';
import { getProductStock, isInStock } from '@/lib/stock';
import { Product } from '@/payload-types';

const baseProduct = {
  id: '1',
  name: 'Product 1',
  slug: 'product-1',
  description: 'Product 1',
  price: 10,
  comparePrice: 5,
  variants: [],
  images: [],
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    ...baseProduct,
    ...overrides,
  } as Product;
}

describe('getProducts', () => {
  it('returns product with variants', () => {
    const product = createProduct({
      variants: [
        {
          name: 'Variant 1',
          value: 'Variant 1',
          stock: 10,
          price: 10,
          id: '1',
        },
      ],
    });
    expect(getProductStock(product)).toBe(10);
  });

  it('returns 0 for product without variants', () => {
    const product = createProduct({ variants: [] });
    expect(getProductStock(product)).toBe(0);
  });

  it('returns sum of variant stock when variant exists', () => {
    const product = createProduct({
      variants: [
        {
          id: '1',
          name: 'Variant 1',
          value: 'Variant 1',
          stock: 10,
          price: 10,
        },
        {
          id: '2',
          name: 'Variant 2',
          value: 'Variant 2',
          stock: 20,
          price: 20,
        },
      ],
    });
    expect(getProductStock(product)).toBe(30);
  });

  it('returns 0 if all variant stock is 0', () => {
    const product = createProduct({
      variants: [
        {
          id: '1',
          name: 'Variant 1',
          value: 'Variant 1',
          stock: 0,
          price: 10,
        },
        {
          id: '2',
          name: 'Variant 2',
          value: 'Variant 2',
          stock: 0,
          price: 20,
        },
      ],
    });
    expect(getProductStock(product)).toBe(0);
  });

  it('returns 0 if variant stock is negative', () => {
    const product = createProduct({
      variants: [
        {
          id: '1',
          name: 'Variant 1',
          value: 'Variant 1',
          stock: -10,
          price: 10,
        },
        {
          id: '2',
          name: 'Variant 2',
          value: 'Variant 2',
          stock: -20,
          price: 20,
        },
      ],
    });
    expect(getProductStock(product)).toBe(0);
  });

  it('returns 0 if variant is undefined', () => {
    const product = createProduct({ variants: undefined });
    expect(getProductStock(product)).toBe(0);
  });

  it('returns 0 if variant is null', () => {
    const product = createProduct({ variants: null });
    expect(getProductStock(product)).toBe(0);
  });

  it('returns 0 if variant stock is undefined', () => {
    const product = createProduct({
      variants: [
        {
          id: '1',
          name: 'Variant 1',
          value: 'Variant 1',
          stock: undefined,
          price: 10,
        },
      ],
    });
    expect(getProductStock(product)).toBe(0);
  });

  it('returns 0 if variant stock is null', () => {
    const product = createProduct({
      variants: [
        {
          id: '1',
          name: 'Variant 1',
          value: 'Variant 1',
          stock: null,
          price: 10,
        },
      ],
    });
    expect(getProductStock(product)).toBe(0);
  });
});

describe('isInStock', () => {
  it('returns true if product variant is in stock', () => {
    const product = createProduct({
      variants: [
        {
          id: '1',
          name: 'Variant 1',
          value: 'Variant 1',
          stock: 10,
          price: 10,
        },
      ],
    });
    expect(isInStock(product, '1')).toBe(true);
  });

  it('returns false if product variant is out of stock', () => {
    const product = createProduct({
      variants: [
        {
          id: '1',
          name: 'Variant 1',
          value: 'Variant 1',
          stock: 0,
          price: 10,
        },
      ],
    });
    expect(isInStock(product, '1')).toBe(false);
  });

  it('returns false if product has no variants', () => {
    const product = createProduct({ variants: [] });
    expect(isInStock(product)).toBe(false);
  });

  it('returns false if variantId is not found', () => {
    const product = createProduct({
      variants: [
        {
          id: '1',
          name: 'Variant 1',
          value: 'Variant 1',
          stock: 10,
          price: 10,
        },
      ],
    });
    expect(isInStock(product, '2')).toBe(false);
  });
});
