'use client';
import { useRouter } from 'next/navigation';
import { User } from '@/payload-types';
import { useCartStore } from '@/store/cart';
import { useEffect, useState } from 'react';
import HeaderPresenter from './header-presenter';

export default function Header() {
  const router = useRouter();

  const totalItems = useCartStore(state => state.totalItems());
  const clearCart = useCartStore(state => state.clearCart);
  const [me, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/users/logout', {
      method: 'POST',
    });
    clearCart();
    router.push('/');
    router.refresh();
  };

  return <HeaderPresenter user={me} totalItems={totalItems} handleLogout={handleLogout} />;
}
