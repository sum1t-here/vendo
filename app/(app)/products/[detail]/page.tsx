import { getProductBySlug } from '@/lib/payload';
import ProductDetail from '@/components/product-detail';

export default async function ProductDetailPage({ params }: { params: Promise<{ detail: string }> }) {
  const { detail } = await params;
  const product = await getProductBySlug(detail);
  return <ProductDetail product={product} />;
}
