import Cart from '@/components/cart';
import { getUser } from '@/lib/getUser';
import { redirect } from 'next/navigation';
import BreadcrumbNav from '@/components/breadcrumb-nav';

export default async function CartPage() {
  const { user } = await getUser();
  if (!user) {
    redirect('/login');
  }
  return (
    <div className="pt-12 px-4 md:px-14 min-h-screen w-full">
      <BreadcrumbNav />
      <Cart user={user} />
    </div>
  );
}
