/* eslint-disable @typescript-eslint/no-explicit-any */

export function getProductStock(product: any) {
  // if product has variants, sum their stocks
  if (product.variants?.length > 0) {
    return product.variants.reduce((sum: number, v: any) => sum + (v.stock ?? 0), 0);
  }
  // otherwise use product stock
  return product.stock;
}

export function isInStock(product: any, variantId?: string) {
  if (variantId) {
    const variant = product.variants?.find((v: any) => v.id === variantId);
    return (variant?.stock ?? 0) > 0;
  }
  return getProductStock(product) > 0;
}
