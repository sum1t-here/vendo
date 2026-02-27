'use client';

import Image from 'next/image';
import HeaderLabel from './header-label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useCartStore } from '@/store/cart';
import { Button } from './ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { User } from '@/payload-types';

interface CartProps {
  user: User | null;
}

export default function Cart({ user }: CartProps) {
  const cart = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeFromCart);
  const emptyCart = useCartStore(state => state.clearCart);
  const totalItems = useCartStore(state => state.totalItems);
  const totalPrice = useCartStore(state => state.totalPrice);
  const updateCartItemQuantity = useCartStore(state => state.updateCartItemQuantity);

  const handleRemoveItem = (id: number, variantId?: number) => {
    removeItem(id, variantId);
    toast.success('Item removed from cart');
  };

  if (cart.length === 0) {
    return (
      <div className="pt-7 px-7 md:px-14 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-black">Your cart is empty</p>
        <Link
          href="/products"
          className="border-2 border-black px-6 py-2 font-bold shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
        >
          Shop Now →
        </Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to checkout');
      return;
    }

    const isAddressIncomplete = (address: typeof user.address) => {
      const requiredFields = ['street', 'city', 'state', 'zip'] as const;
      return requiredFields.some(field => !address?.[field]);
    };

    if (isAddressIncomplete(user.address)) {
      toast.error('Please complete your address', {
        action: {
          label: 'Update Address',
          onClick: () => {
            window.location.href = '/profile';
          },
        },
      });
      return;
    }

    const { session, error } = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    }).then(res => res.json());

    if (error) {
      toast.error(error);
      return;
    }

    if (session?.url) {
      window.location.href = session.url; // ← session.url not url
    }
  };

  return (
    <div className="pt-7 px-7 md:px-14 min-h-screen">
      <div className="flex items-center justify-center w-full mb-7">
        <HeaderLabel text="Cart" />
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary-background">
              <TableHead className="w-[100px] font-black uppercase">Image</TableHead>
              <TableHead className="font-black uppercase">Name</TableHead>
              <TableHead className="font-black uppercase">Price</TableHead>
              <TableHead className="font-black uppercase">Qty</TableHead>
              <TableHead className="font-black uppercase">Subtotal</TableHead>
              <TableHead className="font-black uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {cart.map(item => (
              <TableRow key={`${item.id}-${item.variantId ?? 'default'}`} className="bg-secondary-background w-full">
                <TableCell>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    unoptimized
                    className="border-2 border-black object-cover"
                  />
                </TableCell>
                <TableCell>
                  <p className="font-bold">{item.name}</p>
                  {item.variantValue && <p className="text-xs text-muted-foreground">{item.variantValue}</p>}
                </TableCell>
                <TableCell className="font-medium">₹{item.price}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div
                      className="cursor-pointer text-lg font-extrabold"
                      onClick={() => updateCartItemQuantity(item.id, item.quantity - 1, item.variantId)}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </div>
                    {item.quantity}
                    <div
                      className="cursor-pointer text-lg font-extrabold"
                      onClick={() => updateCartItemQuantity(item.id, item.quantity + 1, item.variantId)}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-bold">₹{item.price * item.quantity}</TableCell>
                <TableCell>
                  <Button onClick={() => handleRemoveItem(item.id, item.variantId)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}

            {/* Total rows */}
            <TableRow className="bg-secondary-background">
              <TableCell colSpan={4} className="text-right font-bold uppercase">
                Total Items
              </TableCell>
              <TableCell className="font-black">{totalItems()}</TableCell>
              <TableCell />
            </TableRow>

            <TableRow className="bg-secondary-background">
              <TableCell colSpan={4} className="text-right font-bold uppercase">
                Total Price
              </TableCell>
              <TableCell className="font-black text-lg">₹{totalPrice()}</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-6">
        <Button
          className="border-2 border-black font-bold shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          onClick={() => emptyCart()}
        >
          Clear Cart
        </Button>

        <Button
          className="bg-black text-white font-black px-8 py-6 border-2 border-black shadow-[4px_4px_0px_#555] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          onClick={handleCheckout}
        >
          Checkout →
        </Button>
      </div>
    </div>
  );
}
