/**
 * CART Collection
 *
 * Payload CMS collection for managing cart
 *
 *  Use cases:
 * - Saving the cart items in the database
 * - Syncing the cart items with the database
 * - Restoring the cart items from the database
 */

import { CollectionConfig } from 'payload';

export const Cart: CollectionConfig = {
  slug: 'cart',
  access: {
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true, // one cart per customer
    },
    {
      name: 'items',
      type: 'json',
    },
  ],
  timestamps: true,
};
