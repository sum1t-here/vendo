import { getProductBySlug, getProducts } from '@/lib/payload';
import ProductDetail from '@/components/product-detail';

export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(product => ({ detail: product.slug }));
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }: { params: Promise<{ detail: string }> }) {
  const { detail } = await params;
  const product = await getProductBySlug(detail);
  return <ProductDetail product={product} />;
}
