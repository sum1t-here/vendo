/**
 * USERS Collection
 *
 * Payload CMS collection for managing:
 * - Login / Logout
 * - Registration
 * - Role based access control (RBAC)
 * - User profile
 *
 * RBAC strategy:
 * - Admin: Full access to all collections
 * - Customer: Read-only access to products, create/read/update/delete orders
 */

import { isAdmin, isAdminAccess } from '../lib/access';
import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',

  admin: {
    // show email as the display title in the admin panel
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'updatedAt', 'createdAt'],
    description: 'Manage all users and their roles',
  },

  // Tells Payload to enable authentication for this collection
  auth: true,

  access: {
    // anyone can create an account
    create: () => true,
    // only admins can read, update, delete all users, customers can only read their own
    read: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === 'admin') return true;
      return {
        id: { equals: req.user.id },
      };
    },
    update: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === 'admin') return true;
      return {
        id: { equals: req.user.id },
      };
    },
    delete: isAdmin,
    // admin access to admin panel
    admin: isAdminAccess,
  },

  fields: [
    // full name of the user
    {
      name: 'name',
      type: 'text',
      required: true,
      minLength: 5,
      maxLength: 20,
    },
    // role of the user
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
      ],

      // Field-level access control
      // Even if a customer sends { role: 'admin' } in a PATCH request,
      // Payload will ignore this field update entirely.
      access: {
        update: ({ req }) => req.user?.role === 'admin',
      },
      admin: {
        position: 'sidebar',
        description: 'Admin has access to full cms access. Customer has storefront access only',
      },
    },
    // address
    {
      name: 'address',
      type: 'group',
      label: 'Default shipping address',
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'zip',
          type: 'text',
          required: true,
        },
      ],
    },
    // stripeCustomerId
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Stripe customer ID. Auto created on first checkout',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
};
