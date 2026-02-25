import { getPayload } from 'payload';
import config from '@payload-config';

/**
 * Fetches all published products
 * @returns {Promise<Product[]>}
 */
export async function getProducts() {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: 'products',
    where: {
      status: {
        equals: 'published',
      },
    },
    depth: 2,
  });

  return docs;
}

/**
 * Fetches a product by slug
 * @param {string} slug - The slug of the product
 * @returns {Promise<Product | null>}
 */
export async function getProductBySlug(slug: string) {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
  });

  return docs[0] ?? null;
}

/**
 * Fetches all published categories
 * @returns {Promise<Category[]>}
 */
export async function getCategories() {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: 'categories',
    depth: 2,
  });

  return docs;
}

export async function getProductsByCategory(slug: string) {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
  });

  const category = docs[0];

  if (!category) return [];

  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      category: {
        equals: category.id,
      },
      status: {
        equals: 'published',
      },
    },
    depth: 2,
  });

  return products;
}
