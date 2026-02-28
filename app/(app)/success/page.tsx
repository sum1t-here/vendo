'use client';
import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import HeaderLabel from '@/components/header-label';

export default function SuccessPage() {
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    const clearEverything = async () => {
      clearCart();

      await fetch('/api/cart', {
        method: 'DELETE',
        credentials: 'include',
      });
    };

    clearEverything();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-6">
      <HeaderLabel text="Order Confirmed" />

      <div className="border-2 border-black shadow-[6px_6px_0px_#000] p-10 flex flex-col items-center gap-5 max-w-md w-full">
        <div className="border-2 border-black p-4 shadow-[3px_3px_0px_#000]">
          <CheckCircle size={40} className="text-green-600" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-black">Payment Successful!</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Your order has been placed. Check your email for the invoice.
          </p>
        </div>

        <div className="w-full border-t-2 border-black pt-4 flex flex-col gap-3">
          <Link
            href="/orders"
            className="w-full text-center bg-black text-white font-black py-3 border-2 border-black shadow-[3px_3px_0px_#555] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            View My Orders →
          </Link>
          <Link
            href="/products"
            className="w-full text-center font-black py-3 border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
