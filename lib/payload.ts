import { getPayload } from 'payload';
import config from '@payload-config';
import { unstable_cache } from 'next/cache';

/**
 * Fetches all published products
 * @returns {Promise<Product[]>}
 * @cached
 */
export const getProducts = unstable_cache(
  async () => {
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
  },
  ['products-all'],
  { revalidate: 3600 }
);

/**
 * Fetches a product by slug
 * @param {string} slug - The slug of the product
 * @returns {Promise<Product | null>}
 * @cached
 */
export const getProductBySlug = (slug: string) =>
  unstable_cache(
    async () => {
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
    },
    ['product-by-slug', slug],
    { revalidate: 3600 }
  )();

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

/**
 * Fetches all published products by category
 * @param {string} slug - The slug of the category
 * @returns {Promise<Product[]>}
 * @cached
 */
export const getProductsByCategory = (slug: string) =>
  unstable_cache(
    async () => {
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
    },
    ['products-by-category', slug],
    { revalidate: 3600 }
  )();

/**
 * Fetches all featured products
 * @returns {Promise<Product[]>}
 * @cached
 */
export const getFeaturedProducts = unstable_cache(
  async () => {
    const payload = await getPayload({ config });

    const { docs } = await payload.find({
      collection: 'products',
      where: {
        featured: {
          equals: true,
        },
      },
      depth: 2,
    });

    return docs;
  },
  ['featured-products'],
  { revalidate: 3600 }
);
