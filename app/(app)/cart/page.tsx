import Cart from '@/components/cart';
import { getUser } from '@/lib/getUser';
import { redirect } from 'next/navigation';

export default async function CartPage() {
  const { user } = await getUser();
  if (!user) {
    redirect('/login');
  }
  return <Cart user={user} />;
}
