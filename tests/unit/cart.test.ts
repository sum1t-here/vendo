import { CartItem, useCartStore } from '@/store/cart';
import { beforeEach, describe, expect, it } from 'vitest';

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

const baseItems: CartItem = {
  id: 1,
  name: 'Product 1',
  price: 10,
  image: '',
  slug: 'product-1',
  quantity: 1,
  variantId: '1',
  variantValue: 'Variant 1',
  variantStock: 10,
};

function createProduct(overrides: Partial<CartItem> = {}): CartItem {
  return { ...baseItems, ...overrides };
}

describe('addToCart', () => {
  it('adds a product to the cart', () => {
    const product = createProduct();
    useCartStore.getState().addToCart(product);
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it('increments quantity if item already in cart', () => {
    const product = createProduct();
    useCartStore.getState().addToCart(product);
    useCartStore.getState().addToCart(product);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it('treats same product with different variants as separate items', () => {
    useCartStore.getState().addToCart(createProduct({ variantId: 'v1' }));
    useCartStore.getState().addToCart(createProduct({ variantId: 'v2' }));
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('throws when quantity exceeds stock', () => {
    const product = createProduct({ variantStock: 1 });
    useCartStore.getState().addToCart(product);
    expect(() => useCartStore.getState().addToCart(product)).toThrow(
      'Only 1 items are available for Product 1 (Variant 1)'
    );
  });
});

describe('removeFromCart', () => {
  it('removes item from cart', () => {
    useCartStore.getState().addToCart(createProduct());
    useCartStore.getState().removeFromCart(1, '1');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('only removes matching variant', () => {
    useCartStore.getState().addToCart(createProduct({ variantId: 'v1' }));
    useCartStore.getState().addToCart(createProduct({ variantId: 'v2' }));
    useCartStore.getState().removeFromCart(1, 'v1');
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].variantId).toBe('v2');
  });

  it('removes item if variantId is not provided', () => {
    useCartStore.getState().addToCart(createProduct({ variantId: 'v1' }));
    useCartStore.getState().removeFromCart(1);
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

describe('clearCart', () => {
  it('empties the cart', () => {
    useCartStore.getState().addToCart(createProduct());
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

describe('totalPrice', () => {
  it('calculates total correctly', () => {
    useCartStore.getState().addToCart(createProduct({ price: 500 }));
    useCartStore.getState().addToCart(createProduct({ price: 500 }));
    expect(useCartStore.getState().totalPrice()).toBe(1000);
  });
});

describe('totalItems', () => {
  it('calculates total items correctly', () => {
    useCartStore.getState().addToCart(createProduct());
    useCartStore.getState().addToCart(createProduct());
    expect(useCartStore.getState().totalItems()).toBe(2);
  });

  describe('updateQuantity', () => {
    it('updates quantity correctly', () => {
      useCartStore.getState().addToCart(createProduct());
      useCartStore.getState().updateCartItemQuantity(1, 2, '1');
      expect(useCartStore.getState().items[0].quantity).toBe(2);
    });

    it('throws when quantity exceeds stock', () => {
      const product = createProduct({ variantStock: 1 });
      useCartStore.getState().addToCart(product);
      expect(() => useCartStore.getState().updateCartItemQuantity(1, 2, '1')).toThrow(
        'Only 1 items are available for Product 1 (Variant 1)'
      );
    });

    it('removes quantity if quantity is less than 1', () => {
      const product = createProduct({ variantStock: 1 });
      useCartStore.getState().addToCart(product);
      useCartStore.getState().updateCartItemQuantity(1, 0, '1');
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('throws when variantId is not provided', () => {
      const product = createProduct({ variantId: undefined });
      expect(() => useCartStore.getState().addToCart(product)).toThrow('Please select a variant for Product 1');
    });

    it('throws when variantStock is undefined', () => {
      const product = createProduct({ variantStock: undefined });
      useCartStore.getState().addToCart(product);
      expect(() => useCartStore.getState().addToCart(product)).toThrow('Only 0 items are available');
    });

    it('throws when variantStock is undefined', () => {
      const product = createProduct({ variantStock: undefined });
      useCartStore.getState().addToCart(product);
      expect(() => useCartStore.getState().updateCartItemQuantity(1, 2, '1')).toThrow('Only 0 items are available');
    });

    it('only increments matching item when multiple items in cart', () => {
      useCartStore.getState().addToCart(createProduct({ variantId: 'v1' }));
      useCartStore.getState().addToCart(createProduct({ variantId: 'v2' }));
      useCartStore.getState().addToCart(createProduct({ variantId: 'v1' }));
      expect(useCartStore.getState().items.find(i => i.variantId === 'v1')?.quantity).toBe(2);
      expect(useCartStore.getState().items.find(i => i.variantId === 'v2')?.quantity).toBe(1);
    });

    it('only updates matching item when multiple items in cart', () => {
      useCartStore.getState().addToCart(createProduct({ variantId: 'v1', variantStock: 10 }));
      useCartStore.getState().addToCart(createProduct({ variantId: 'v2', variantStock: 10 }));
      useCartStore.getState().updateCartItemQuantity(1, 5, 'v1');
      expect(useCartStore.getState().items.find(i => i.variantId === 'v1')?.quantity).toBe(5);
      expect(useCartStore.getState().items.find(i => i.variantId === 'v2')?.quantity).toBe(1);
    });
  });
});
