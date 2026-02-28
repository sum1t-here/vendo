import HeaderLabel from '@/components/header-label';
import Orders from '@/components/orders';
import { getUser } from '@/lib/getUser';
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
    const {payload, user} = await getUser();
    const orders = await payload.find({
        collection: 'orders',
        where: {
            customer: {
                equals: user?.id
            }
        },
        depth: 2,
        limit: 25
    });

    if(!user) {
       redirect('/login');
    }

  return (
    <div className="px-4 md:px-14 py-12 min-h-screen">
      <div className="flex flex-col w-full justify-center items-center gap-2">
        <HeaderLabel text="Orders" />
      </div>
      <Orders orders={orders.docs} />
    </div>
  );
}