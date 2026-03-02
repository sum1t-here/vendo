/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkoutSessionCompleted } from '@/lib/webhooks/checkout-completed';
import { describe, expect, it, vi } from 'vitest';

describe('checkoutSessionCompleted', () => {
  it('should create order and send email', async () => {
    const mockPayload = {
      // duplicated item check
      find: vi
        .fn()
        .mockResolvedValueOnce({
          docs: [],
        })
        .mockResolvedValueOnce({
          docs: [
            {
              id: 1,
              name: 'test-product',
              price: 100,
              variants: [{ id: 1, name: 'Size', value: 'M', stock: 10 }],
            },
          ],
        }),
      // user check
      findByID: vi.fn().mockResolvedValue({
        id: 1,
        email: 'test-email@test.com',
        name: 'test-user',
        address: {
          street: 'test-street',
          city: 'test-city',
          state: 'test-state',
          zip: 'test-zip',
        },
      }),
      update: vi.fn().mockResolvedValue({}),
      create: vi.fn().mockResolvedValue({
        id: 1,
      }),
      sendEmail: vi.fn().mockResolvedValue({}),
    };

    const mockEvent = {
      id: 'test-event-id',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'test-session-id',
          amount_total: 10000,
          metadata: {
            userId: '1',
            items: JSON.stringify([
              {
                id: 1,
                name: 'test-product',
                price: 100,
                quantity: 1,
                variantId: 1,
                variantValue: 'test-variant',
                image: 'test-image',
              },
            ]),
          },
        },
      },
    };

    await checkoutSessionCompleted({
      payload: mockPayload as any,
      event: mockEvent as any,
      config: {} as any,
      req: {} as any,
      stripe: {} as any,
      pluginConfig: {} as any,
    });

    expect(mockPayload.create).toHaveBeenCalledTimes(1);
    expect(mockPayload.create).toHaveBeenCalledWith({
      collection: 'orders',
      data: {
        customer: 1,
        items: [
          {
            product: 1,
            productName: 'test-product',
            price: 100,
            quantity: 1,
            variantId: '1',
            variantValue: 'test-variant',
          },
        ],
        total: 100,
        status: 'paid',
        stripeSessionId: 'test-session-id',
        shippingAddress: {
          address1: 'test-street',
          city: 'test-city',
          state: 'test-state',
          zip: 'test-zip',
        },
      },
    });

    expect(mockPayload.sendEmail).toHaveBeenCalled();
    expect(mockPayload.update).toHaveBeenCalledTimes(1);
    expect(mockPayload.sendEmail).toHaveBeenCalledTimes(1);
    expect(mockPayload.sendEmail).toHaveBeenCalledWith({
      to: 'test-email@test.com',
      subject: 'Order Confirmation - #1',
      html: expect.any(String),
    });
  });

  it('should not create an order if existing order found', async () => {
    const mockPayload = {
      // duplicated item check
      find: vi.fn().mockResolvedValueOnce({
        docs: [
          {
            id: 1,
            name: 'test-product',
            price: 100,
            variants: [{ id: 1, name: 'Size', value: 'M', stock: 10 }],
          },
        ],
      }),
      // user check
      findByID: vi.fn().mockResolvedValue({
        id: 1,
        email: 'test-email@test.com',
        name: 'test-user',
        address: {
          street: 'test-street',
          city: 'test-city',
          state: 'test-state',
          zip: 'test-zip',
        },
      }),
      update: vi.fn().mockResolvedValue({}),
      create: vi.fn().mockResolvedValue({
        id: 1,
      }),
      sendEmail: vi.fn().mockResolvedValue({}),
    };

    const mockEvent = {
      id: 'test-event-id',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'test-session-id',
          amount_total: 10000,
          metadata: {
            userId: '1',
            items: JSON.stringify([
              {
                id: 1,
                name: 'test-product',
                price: 100,
                quantity: 1,
                variantId: 1,
                variantValue: 'test-variant',
                image: 'test-image',
              },
            ]),
          },
        },
      },
    };

    await checkoutSessionCompleted({
      payload: mockPayload as any,
      event: mockEvent as any,
      config: {} as any,
      req: {} as any,
      stripe: {} as any,
      pluginConfig: {} as any,
    });

    expect(mockPayload.create).toHaveBeenCalledTimes(0);
    expect(mockPayload.sendEmail).toHaveBeenCalledTimes(0);
    expect(mockPayload.update).toHaveBeenCalledTimes(0);
    expect(mockPayload.sendEmail).toHaveBeenCalledTimes(0);
  });

  it('should not create order if product not found during stock deduction', async () => {
    const consoleSpy = vi.spyOn(console, 'error');
    const mockPayload = {
      // duplicated item check
      find: vi
        .fn()
        .mockResolvedValueOnce({
          docs: [],
        })
        .mockResolvedValueOnce({
          docs: [],
        }),
      // user check
      findByID: vi.fn().mockResolvedValue({
        id: 1,
        email: 'test-email@test.com',
        name: 'test-user',
        address: {
          street: 'test-street',
          city: 'test-city',
          state: 'test-state',
          zip: 'test-zip',
        },
      }),
      update: vi.fn().mockResolvedValue({}),
      create: vi.fn().mockResolvedValue({
        id: 1,
      }),
      sendEmail: vi.fn().mockResolvedValue({}),
    };

    const mockEvent = {
      id: 'test-event-id',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'test-session-id',
          amount_total: 10000,
          metadata: {
            userId: '1',
            items: JSON.stringify([
              {
                id: 1,
                name: 'test-product',
                price: 100,
                quantity: 1,
                variantId: 1,
                variantValue: 'test-variant',
                image: 'test-image',
              },
            ]),
          },
        },
      },
    };

    await checkoutSessionCompleted({
      payload: mockPayload as any,
      event: mockEvent as any,
      config: {} as any,
      req: {} as any,
      stripe: {} as any,
      pluginConfig: {} as any,
    });

    expect(mockPayload.create).toHaveBeenCalledTimes(0);
    expect(mockPayload.sendEmail).toHaveBeenCalledTimes(0);
    expect(mockPayload.update).toHaveBeenCalledTimes(0);
    expect(mockPayload.sendEmail).toHaveBeenCalledTimes(0);
    expect(consoleSpy).toHaveBeenCalledWith('Product not found for id:', 1);
    consoleSpy.mockRestore();
  });

  it('email should fail silently', async () => {
    const consoleSpy = vi.spyOn(console, 'error');
    const mockPayload = {
      // duplicated item check
      find: vi
        .fn()
        .mockResolvedValueOnce({
          docs: [],
        })
        .mockResolvedValueOnce({
          docs: [
            {
              id: 1,
              name: 'test-product',
              price: 100,
              variants: [{ id: 1, name: 'Size', value: 'M', stock: 10 }],
            },
          ],
        }),
      // user check
      findByID: vi.fn().mockResolvedValue({
        id: 1,
        email: 'buggy-email',
        name: 'test-user',
        address: {
          street: 'test-street',
          city: 'test-city',
          state: 'test-state',
          zip: 'test-zip',
        },
      }),
      update: vi.fn().mockResolvedValue({}),
      create: vi.fn().mockResolvedValue({
        id: 1,
      }),
      sendEmail: vi.fn().mockRejectedValue({}),
    };

    const mockEvent = {
      id: 'test-event-id',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'test-session-id',
          amount_total: 10000,
          metadata: {
            userId: '1',
            items: JSON.stringify([
              {
                id: 1,
                name: 'test-product',
                price: 100,
                quantity: 1,
                variantId: 1,
                variantValue: 'test-variant',
                image: 'test-image',
              },
            ]),
          },
        },
      },
    };

    await checkoutSessionCompleted({
      payload: mockPayload as any,
      event: mockEvent as any,
      config: {} as any,
      req: {} as any,
      stripe: {} as any,
      pluginConfig: {} as any,
    });

    expect(mockPayload.create).toHaveBeenCalledTimes(1);
    expect(mockPayload.sendEmail).toHaveBeenCalledTimes(1);
    expect(mockPayload.update).toHaveBeenCalledTimes(1);
    expect(mockPayload.sendEmail).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to send email');
    consoleSpy.mockRestore();
  });
});
