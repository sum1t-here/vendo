import { Product } from '@/payload-types';

type Variant = NonNullable<Product['variants']>[number];

export function getProductStock(product: Product) {
  // if product has variants, sum their stocks
  if ((product.variants?.length ?? 0) > 0) {
    return product.variants!.reduce((sum: number, v: Variant) => sum + (v.stock ?? 0), 0);
  }
  // otherwise use product stock
  return product.stock ?? 0;
}

export function isInStock(product: Product, variantId?: string): boolean {
  // if variantId is provided, check variant stock
  if (variantId) {
    const variant = product.variants?.find((v: Variant) => v.id === variantId);
    return (variant?.stock ?? 0) > 0;
  }
  // otherwise check product stock
  return getProductStock(product) > 0;
}
