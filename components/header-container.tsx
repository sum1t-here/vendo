'use client';
import { usePathname, useRouter } from 'next/navigation';
import { User } from '@/payload-types';
import { useCartStore } from '@/store/cart';
import { useEffect, useState } from 'react';
import HeaderPresenter from './header-presenter';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

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
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/users/logout', {
      method: 'POST',
    });
    setUser(null);
    clearCart();
    router.refresh();
    router.push('/');
  };

  return <HeaderPresenter user={me} totalItems={totalItems} handleLogout={handleLogout} />;
}
