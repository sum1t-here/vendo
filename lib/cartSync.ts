import { CartItem } from '@/store/cart';

export async function saveCartToServer(items: CartItem[]) {
  await fetch('/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // include cookies
    credentials: 'include',
    body: JSON.stringify(items),
  });
}

export async function fetchCartFromServer(): Promise<CartItem[]> {
  const response = await fetch('/api/cart', {
    // include cookies
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  const data = await response.json();
  return data.items ?? [];
}
