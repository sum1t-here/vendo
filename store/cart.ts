import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
  variantId?: number;
  variantValue?: string;
}

interface cartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, variantId?: number) => void;
  updateCartItemQuantity: (id: number, quantity: number, variantId?: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<cartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item: CartItem) => {
        const existingItem = get().items.find(
          cartItem => cartItem.id === item.id && cartItem.variantId === item.variantId
        );
        if (existingItem) {
          set(state => ({
            items: state.items.map(cartItem =>
              cartItem.id === item.id && cartItem.variantId === item.variantId
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
          }));
        } else {
          set(state => ({
            items: [...state.items, { ...item, quantity: 1 }],
          }));
        }
      },
      removeFromCart: (id: number, variantId?: number) => {
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
      },
      updateCartItemQuantity: (id: number, quantity: number, variantId?: number) => {
        set(state => ({
          items: state.items.map(cartItem =>
            cartItem.id === id && cartItem.variantId === variantId ? { ...cartItem, quantity } : cartItem
          ),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
