import { CartItem } from '@/store/cart';

export const syncToServer = async (items: CartItem[]) => {
  await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
};

// debounced sync to server
let syncTimeout: ReturnType<typeof setTimeout> | null = null;
export const debouncedSyncToServer = (items: CartItem[]) => {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  syncTimeout = setTimeout(() => {
    syncToServer(items);
  }, 1000);
};
