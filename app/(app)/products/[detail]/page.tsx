import { getProductBySlug, getProducts } from '@/lib/payload';
import ProductDetail from '@/components/product-detail';
import BreadcrumbNav from '@/components/breadcrumb-nav';

export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(product => ({ detail: product.slug }));
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }: { params: Promise<{ detail: string }> }) {
  const { detail } = await params;
  const product = await getProductBySlug(detail);
  return (
    <div>
      <div className="py-12 px-4 md:px-14 w-full">
        <BreadcrumbNav />
      </div>
      <ProductDetail product={product} />
    </div>
  );
}
