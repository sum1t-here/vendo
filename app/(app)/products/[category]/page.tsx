import ProductPage from '@/components/product-page';

export default async function ProductsPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return <ProductPage category={category} />;
}
