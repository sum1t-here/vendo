import { formatDate } from '@/lib/date'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Orders({ orders }: { orders: any }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="pt-7 px-7 md:px-14 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-black">No orders yet</p>
        
        <Link
          href="/products"
          className="border-2 border-black px-6 py-2 font-bold shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
        >
          Start Shopping →
        </Link>
      </div>
    )
  }

  const statusStyles: Record<string, string> = {
    paid:        'bg-green-100 text-green-800 border-green-800',
    pending:     'bg-yellow-100 text-yellow-800 border-yellow-800',
    processing:  'bg-blue-100 text-blue-800 border-blue-800',
    shipped:     'bg-purple-100 text-purple-800 border-purple-800',
    delivered:   'bg-green-200 text-green-900 border-green-900',
    cancelled:   'bg-red-100 text-red-800 border-red-800',
    refunded:    'bg-gray-100 text-gray-800 border-gray-800',
  }

  return (
    <div className="pt-7 px-7 md:px-14 min-h-screen">

      <div className="flex flex-col gap-6">
        {orders.map((order: any) => (
          <div
            key={order.id}
            className="border-2 border-black shadow-[6px_6px_0px_#000]"
          >
            {/* Order Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-b-2 border-black bg-secondary-background">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Order ID
                </p>
                <p className="font-black text-lg">#{order.id}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Date
                </p>
                <p className="font-bold">{formatDate(order.updatedAt)}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Total
                </p>
                <p className="font-black text-lg">₹{order.total}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Status
                </p>
                <span
                  className={`border-2 px-3 py-1 text-xs font-black uppercase w-fit ${
                    statusStyles[order.status] ?? 'bg-gray-100 border-gray-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {order.trackingNumber && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Tracking
                  </p>
                  <p className="font-bold text-sm">{order.trackingNumber}</p>
                </div>
              )}
            </div>

            {/* Order Items Table */}
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-black bg-secondary-background">
                  <TableHead className="font-black uppercase text-xs">Product</TableHead>
                  <TableHead className="font-black uppercase text-xs">Variant</TableHead>
                  <TableHead className="font-black uppercase text-xs">Price</TableHead>
                  <TableHead className="font-black uppercase text-xs">Qty</TableHead>
                  <TableHead className="font-black uppercase text-xs">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item: any) => (
                  <TableRow key={item.id} className="border-b border-black last:border-0 bg-secondary-background">
                    <TableCell className="font-bold">
                      {item.productName ?? item.product?.name ?? '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {item.variantValue ?? '—'}
                    </TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="font-bold">
                      ₹{item.price * item.quantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Shipping Address */}
            {order.shippingAddress?.address1 && (
              <div className="p-4 border-t-2 border-black bg-secondary-background">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Shipped To
                </p>
                <p className="text-sm font-bold">{order.shippingAddress.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.address1}
                  {order.shippingAddress.address2 && `, ${order.shippingAddress.address2}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zip}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}