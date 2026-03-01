import { stripe } from '@/lib/stripe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// mock stripe
vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          url: 'https://checkout.stripe.com/test',
          id: 'test-session-id',
        }),
      },
    },
  },
}));

// mock headers
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue({
      value: 'test-token',
    }),
  }),
}));

// mock payload
vi.mock('payload', async importOriginal => {
  const actual = await importOriginal<typeof import('payload')>();
  return {
    ...actual,
    getPayload: vi.fn().mockResolvedValue({
      auth: vi.fn().mockResolvedValue({
        user: {
          id: 1,
        },
      }),
      find: vi.fn().mockResolvedValue({
        docs: [
          {
            id: 1,
            name: 'test-product',
            price: 100,
            variants: [
              {
                id: 1,
                name: 'test-variant',
                price: 100,
                stock: 10,
              },
            ],
          },
        ],
      }),
    }),
  };
});

describe('POST /api/checkout',  () => {
  beforeEach(async () => {
    vi.clearAllMocks()

    // restore default mock after reset
  const { getPayload } = await import('payload')
  vi.mocked(getPayload).mockResolvedValue({
    auth: vi.fn().mockResolvedValue({ user: { id: 1 } }),
    find: vi.fn().mockResolvedValue({
      docs: [{
        id: 1,
        name: 'test-product',
        price: 100,
        status: 'published',
        variants: [{ id: 1, name: 'test-variant', price: 100, stock: 10 }],
      }],
    }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)

  // restore stripe mock
  const { stripe } = await import('@/lib/stripe')
  vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
    url: 'https://checkout.stripe.com/test',
    id: 'test-session-id',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
  })

  it('should return session', async () => {
    const { POST } = await import('@/app/(app)/api/checkout/route');
    const req = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: 1,
            name: 'test-product',
            price: 100,
            quantity: 1,
            variantId: 1,
            variantValue: 'test-variant',
            image: 'test-image',
          },
        ],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('session');
    expect(data.session).toHaveProperty('url');
    expect(data.session).toHaveProperty('id');
  });

  it('should return error if no items', async () => {
    const { POST } = await import('@/app/(app)/api/checkout/route');
    const req = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('At least one item is required');
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it('should return error if no stock', async () => {
    const { getPayload } = await import('payload');

    vi.mocked(getPayload).mockResolvedValueOnce({
      auth: vi.fn().mockResolvedValue({
        user: {
          id: 1,
        },
      }),
      find: vi.fn().mockResolvedValue({
        docs: [
          {
            id: 1,
            name: 'test-product',
            price: 100,
            variants: [
              {
                id: 1,
                name: 'test-variant',
                price: 100,
                stock: 0,
              },
            ],
          },
        ],
      }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { POST } = await import('@/app/(app)/api/checkout/route');
    const req = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: 1,
            name: 'test-product',
            price: 100,
            quantity: 1,
            variantId: 1,
            variantValue: 'test-variant',
            image: 'test-image',
          },
        ],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Product stock is not enough');
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it("should return error if variant not found", async () => {
    const { getPayload } = await import('payload');

    vi.mocked(getPayload).mockResolvedValueOnce({
      auth: vi.fn().mockResolvedValue({
        user: {
          id: 1,
        },
      }),
      find: vi.fn().mockResolvedValue({
        docs: [
          {
            id: 1,
            name: 'test-product',
            price: 100,
            variants: [
              {
                id: 1,
                name: 'test-variant',
                price: 100,
                stock: 10,
              },
            ],
          },
        ],
      }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { POST } = await import('@/app/(app)/api/checkout/route');
    const req = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: 1,
            name: 'test-product',
            price: 100,
            quantity: 1,
            variantId: 2,
            variantValue: 'test-variant',
            image: 'test-image',
          },
        ],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Variant not found');
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it("should return error if product not found", async () => {
    const { getPayload } = await import('payload');

    vi.mocked(getPayload).mockResolvedValueOnce({
      auth: vi.fn().mockResolvedValue({
        user: {
          id: 1,
        },
      }),
      find: vi.fn().mockResolvedValue({
        docs: [],
      }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { POST } = await import('@/app/(app)/api/checkout/route');
    const req = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: 2,
            name: 'test-product',
            price: 100,
            quantity: 1,
            variantId: 1,
            variantValue: 'test-variant',
            image: 'test-image',
          },
        ],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Product not found');
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it("should return error if body is not valid", async () => {
    const { stripe } = await import('@/lib/stripe');
    vi.mocked(stripe.checkout.sessions.create).mockRejectedValueOnce(new Error('Stripe error'));
    const { POST } = await import('@/app/(app)/api/checkout/route');
    const req = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: 1,
            name: 'test-product',
            price: 100,
            quantity: 1,
            variantId: 1,
            variantValue: 'test-variant',
            image: 'test-image',
          },
        ],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Something went wrong');
    expect(stripe.checkout.sessions.create).toHaveBeenCalled();
  });

  it("should return error if payload token not found", async () => {
    const { getPayload } = await import('payload');
    vi.mocked(getPayload).mockResolvedValueOnce({
      auth: vi.fn().mockResolvedValue(null),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { POST } = await import('@/app/(app)/api/checkout/route');
    const req = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: 1,
            name: 'test-product',
            price: 100,
            quantity: 1,
            variantId: 1,
            variantValue: 'test-variant',
            image: 'test-image',
          },
        ],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('No user found');
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  })

  it("should return error if product has no variants", async () => {
    const { getPayload } = await import('payload');
    vi.mocked(getPayload).mockResolvedValueOnce({
      auth: vi.fn().mockResolvedValue({
        user: {
          id: 1,
        },
      }),
      find: vi.fn().mockResolvedValue({
        docs: [
          {
            id: 1,
            name: 'test-product',
            price: 100,
            variants: [],
          },
        ],
      }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { POST } = await import('@/app/(app)/api/checkout/route');
    const req = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: 1,
            name: 'test-product',
            price: 100,
            quantity: 1,
            variantId: 1,
            variantValue: 'test-variant',
            image: 'test-image',
          },
        ],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Product has no variants');
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  })

  it("should return error if cart item has no variant id", async () => {
    const { getPayload } = await import('payload');
    vi.mocked(getPayload).mockResolvedValueOnce({
      auth: vi.fn().mockResolvedValue({
        user: {
          id: 1,
        },
      }),
      find: vi.fn().mockResolvedValue({
        docs: [
          {
            id: 1,
            name: 'test-product',
            price: 100,
            variants: [
              {
                id: 1,
                name: 'test-variant',
                price: 100,
                stock: 10,
              },
            ],
          },
        ],
      }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { POST } = await import('@/app/(app)/api/checkout/route');
    const req = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: 1,
            name: 'test-product',
            price: 100,
            quantity: 1,
            variantId: null,
            variantValue: 'test-variant',
            image: 'test-image',
          },
        ],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Invalid input');
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  })

  it("should return error if cart item price and product variant price not match", async () => {
    const { getPayload } = await import('payload');
    vi.mocked(getPayload).mockResolvedValueOnce({
      auth: vi.fn().mockResolvedValue({
        user: {
          id: 1,
        },
      }),
      find: vi.fn().mockResolvedValue({
        docs: [
          {
            id: 1,
            name: 'test-product',
            price: 100,
            variants: [
              {
                id: 1,
                name: 'test-variant',
                price: 100,
                stock: 10,
              },
            ],
          },
        ],
      }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { POST } = await import('@/app/(app)/api/checkout/route');
    const req = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: 1,
            name: 'test-product',
            price: 9,
            quantity: 1,
            variantId: 1,
            variantValue: 'test-variant',
            image: 'test-image',
          },
        ],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Product price has changed');
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  })
});