import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
  variantId?: string;
  variantValue?: string;
  variantStock?: number;
}

interface cartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, variantId?: string) => void;
  updateCartItemQuantity: (id: number, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const syncToServer = async (items: CartItem[]) => {
  await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
};

// debounced sync to server
let syncTimeout: ReturnType<typeof setTimeout> | null = null;
const debouncedSyncToServer = (items: CartItem[]) => {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  syncTimeout = setTimeout(() => {
    syncToServer(items);
  }, 1000);
};

export const useCartStore = create<cartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item: CartItem) => {
        // check if item is already in cart
        const existingItem = get().items.find(
          cartItem => cartItem.id === item.id && cartItem.variantId === item.variantId
        );
        if (existingItem) {
          // check if adding more items will exceed the stock
          const maxStock = existingItem.variantStock ?? 0;
          if (existingItem.quantity >= maxStock) {
            toast.error(`Only ${maxStock} items are available for ${existingItem.name} (${existingItem.variantValue})`);
            return;
          }
          set(state => ({
            items: state.items.map(cartItem =>
              cartItem.id === item.id && cartItem.variantId === item.variantId
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
          }));
        } else {
          // add new item to cart
          set(state => ({
            items: [...state.items, { ...item, quantity: 1 }],
          }));
        }
        syncToServer(get().items);
      },
      removeFromCart: (id: number, variantId?: string) => {
        set({
          items: get().items.filter(cartItem => {
            if (variantId !== undefined) {
              // if variantId is defined, remove the item if both id and variantId match
              return !(cartItem.id === id && cartItem.variantId === variantId);
            }
            // if variantId is not defined, remove the item if only id matches
            return !(cartItem.id === id);
          }),
        });
        syncToServer(get().items);
      },
      updateCartItemQuantity: (id: number, quantity: number, variantId?: string) => {
        const existingItem = get().items.find(cartItem => cartItem.id === id && cartItem.variantId === variantId);
        const maxStock = existingItem?.variantStock ?? 0;
        if (quantity > maxStock) {
          toast.error(`Only ${maxStock} items are available for ${existingItem?.name} (${existingItem?.variantValue})`);
          return;
        }
        // if quantity is 0 or less, remove the item from cart
        if (quantity <= 0) {
          get().removeFromCart(id, variantId);
          return;
        }
        set(state => ({
          items: state.items.map(cartItem =>
            cartItem.id === id && cartItem.variantId === variantId ? { ...cartItem, quantity } : cartItem
          ),
        }));
        debouncedSyncToServer(get().items);
      },
      // clear cart
      clearCart: () => {
        set({ items: [] });
      },
      // get total items
      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      // get total price
      totalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    // store cart items in local storage
    {
      name: 'cart-storage',
    }
  )
);
