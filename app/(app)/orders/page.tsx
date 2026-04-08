import BreadcrumbNav from '@/components/breadcrumb-nav';
import HeaderLabel from '@/components/header-label';
import Orders from '@/components/orders';
import { getUser } from '@/lib/getUser';
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
  const { payload, user } = await getUser();
  const orders = await payload.find({
    collection: 'orders',
    where: {
      customer: {
        equals: user?.id,
      },
    },
    depth: 2,
    limit: 25,
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <div className="py-12 px-4 md:px-14 w-full">
        <BreadcrumbNav />
      </div>
      <div className="flex flex-col w-full justify-center items-center gap-2">
        <HeaderLabel text="Orders" />
      </div>
      <Orders orders={orders.docs} />
    </div>
  );
}
