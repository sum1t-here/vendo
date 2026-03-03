import ProductCategoryPage from '@/components/product-category-page';
import { getCategories } from '@/lib/payload';

export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map(category => ({ category: category.slug }));
}

export const revalidate = 3600;

export default async function ProductsPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return <ProductCategoryPage category={category} />;
}
