/**
 * ORDERS Collection
 *
 * Payload CMS collection for managing orders
 *
 * Use cases:
 *  - Admins view and manage all orders from /admin dashboard
 *  - Customers view their own order history from /account/orders
 *  - Stripe webhook creates an order after checkout.session.completed
 *  - Admin updates order status as it progresses (paid → shipped → delivered)
 */

import { isAdmin } from '../lib/access';
import type { CollectionConfig } from 'payload';

export const Orders: CollectionConfig = {
  slug: 'orders',
  // disable versioning
  versions: false,
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'customer', 'total', 'createdAt'],
    description: 'Manage all orders',
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === 'admin') return true;
      // Customers see only their own orders
      return {
        customer: { equals: req.user.id },
      };
    },
    update: isAdmin,
    delete: () => false,
    create: isAdmin,
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Customer who placed the order',
      },
    },
    // snapshot of the cart at the time of checkout
    {
      name: 'items',
      type: 'array',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Items in the order',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          admin: { description: 'Reference to the product' },
        },
        {
          name: 'productName',
          type: 'text',
          required: true,
          admin: { description: 'Product name at time of purchase' },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: { description: 'Price at time of purchase' },
        },
        {
          name: 'quantity',
          type: 'number',
          min: 1,
          required: true,
        },
        {
          name: 'variantId',
          type: 'text',
          admin: { description: 'Variant ID at time of purchase' },
        },
        {
          name: 'variantValue',
          type: 'text',
          admin: { description: 'Variant value e.g. S, M, Red' },
        },
      ],
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Total amount of the order',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Order status',
      },
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Stripe session ID',
        readOnly: true,
      },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      label: 'Shipping Address',
      admin: {
        description: 'Shipping address',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Recipient Name',
        },
        {
          name: 'address1',
          type: 'text',
          label: 'Address Line 1',
        },
        {
          name: 'address2',
          type: 'text',
          label: 'Address Line 2',
        },
        {
          name: 'city',
          type: 'text',
          label: 'City',
        },
        {
          name: 'state',
          type: 'text',
          label: 'State',
        },
        {
          name: 'zip',
          type: 'text',
          label: 'Zip Code',
        },
        {
          name: 'country',
          type: 'text',
        },
        {
          name: 'phone',
          type: 'text',
        },
      ],
    },
    // tracking number send by admin once the order is shipped
    {
      name: 'trackingNumber',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Tracking number',
      },
    },
    // internal notes for the admin
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Internal notes for the admin',
      },
    },
  ],

  timestamps: true,
};
