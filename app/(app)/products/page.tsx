import { getProducts, getCategories } from '@/lib/payload';
import ProductCard from '@/components/product-card';
import BreadcrumbNav from '@/components/breadcrumb-nav';

export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map(category => ({ category: category.slug }));
}

export const revalidate = 3600;

export default async function ProductsPage() {
  const products = await getProducts();

  if (!products) {
    return <div>No products found</div>;
  }
  return (
    <div>
      <div className="pt-12 px-4 md:px-14 w-full">
        <BreadcrumbNav />
      </div>
      <ul className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-2 place-items-center w-full">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
}
