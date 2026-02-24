/**
 * MEDIA Collection
 *
 * Payload CMS collection for managing media files
 */

import { isAdmin } from '../lib/access';
import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  // staticDir is the directory where the files will be stored
  upload: {
    staticDir: 'public/uploads',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
        withoutEnlargement: true,
      },
      {
        name: 'card',
        width: 600,
        height: 600,
        position: 'centre',
        withoutEnlargement: true,
      },
      {
        name: 'feature',
        width: 1200,
        height: 900,
        position: 'centre',
        withoutEnlargement: true,
      },
    ],
    adminThumbnail: 'thumbnail',

    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },

  admin: {
    defaultColumns: ['filename', 'alt', 'createdAt'],
    description: 'Upload media files',
  },
  access: {
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
    create: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: { description: 'Alt text for the image' },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Caption for the image' },
    },
  ],

  timestamps: true,
};
