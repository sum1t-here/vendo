/**
 * PRODUCTS Collection
 *
 * The core inventory collection. Every item sold on vendo is a product.
 *
 * Use case:
 * - Admin create and mange products via admin panel
 * - Customers view products on storefront
 * - Customers add products to cart
 * - Customers checkout with products
 * - Customers view their orders with products
 */

import { isAdmin } from '../lib/access';
import type { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'stock', 'status', 'category', 'updatedAt', 'createdAt'],
    description: 'Manage all products',
    // group products by status in the admin list view
    listSearchableFields: ['name', 'slug'],
  },
  access: {
    create: isAdmin,
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true;
      // only view published products
      return {
        status: { equals: 'published' },
      };
    },
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      minLength: 5,
      maxLength: 20,
    },
    // slug
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Unique identifier for the product',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Product description',
      },
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Selling price in INR. e.g. 2999 = ₹2999',
      },
    },
    // compare price
    {
      name: 'comparePrice',
      type: 'number',
      min: 0,
      admin: {
        position: 'sidebar',
        description: 'Original price for showing discounts. Leave empty if not on sale.',
      },
    },
    {
      name: 'stock',
      type: 'number',
      min: 0,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Number of items available in stock',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'Category of the product',
      },
    },
    {
      name: 'image',
      type: 'array',
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: 'imageUrl',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          admin: {
            description: 'Alt text for the image',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
        description: 'Product status',
      },
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Product Variants',
      admin: {
        description: 'Optional. Add size, color, or other variations with their own price and stock',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Variant name. e.g. Size, Color',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'Variant value. e.g. S, M, L, Red, Blue',
          },
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
          admin: {
            description: 'Variant price. Leave empty to use base product price',
          },
        },
        {
          name: 'stock',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
      ],
    },
  ],
  timestamps: true,
};