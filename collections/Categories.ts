/**
 * CATEGORIES Collection
 *
 * Payload CMS collection for managing categories
 *
 *  Use cases:
 *  - Filter products on the storefront by category
 *  - Display category pages at /products?category=shoes
 *  - Show category navigation in the Navbar
 */

import { isAdmin } from '../lib/access';
import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
  slug: 'categories',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt', 'createdAt'],
    description: 'Manage all categories',
  },
  access: {
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
    create: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Unique identifier for the category',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Category description',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Category image',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Featured category',
      },
    },
  ],
  timestamps: true,
};
