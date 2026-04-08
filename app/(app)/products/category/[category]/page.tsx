import BreadcrumbNav from '@/components/breadcrumb-nav';
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
  return (
    <div>
      <div className="py-12 px-4 md:px-14 w-full">
        <BreadcrumbNav />
      </div>
      <ProductCategoryPage category={category} />
    </div>
  );
}
