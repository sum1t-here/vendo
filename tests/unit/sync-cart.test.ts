import { debouncedSyncToServer, syncToServer } from '@/lib/sync-cart';
import { CartItem } from '@/store/cart';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('syncToServer', () => {
  it('calls fetch with the cart items', async () => {
    const items: CartItem[] = [
      {
        id: 1,
        name: 'Test',
        price: 100,
        image: 'img.jpg',
        slug: 'test',
        quantity: 2,
        variantId: 'v1',
        variantValue: 'M',
        variantStock: 10,
      },
    ];

    await syncToServer(items);

    expect(fetch).toHaveBeenCalledTimes(1);

    expect(fetch).toHaveBeenCalledWith('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
  });
});

describe('debouncedSyncToServer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should only call fetch once with the last payload when spammed', async () => {
    const item1: CartItem[] = [{ id: 1, name: 'A', price: 10, image: '', slug: '', quantity: 1 }];

    const item2: CartItem[] = [{ id: 2, name: 'B', price: 20, image: '', slug: '', quantity: 1 }];

    const item3: CartItem[] = [{ id: 3, name: 'C', price: 30, image: '', slug: '', quantity: 1 }];

    // spam calls
    debouncedSyncToServer(item1);
    debouncedSyncToServer(item2);
    debouncedSyncToServer(item3);

    // BEFORE advancing time, nothing should happen
    expect(fetch).not.toHaveBeenCalled();

    // advance full delay
    vi.advanceTimersByTime(1000);

    // flush async queue
    await Promise.resolve();

    // Should only be called once
    expect(fetch).toHaveBeenCalledTimes(1);

    // Should send the LAST payload only
    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string);

    expect(body.items[0].id).toBe(3);
  });
});
