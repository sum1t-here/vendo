import HeaderLabel from './header-label';
import ProductCard from './product-card';
import { getFeaturedProducts } from '@/lib/payload';

export default async function FeaturedProductsPage() {
  const products = await getFeaturedProducts();

  if (!products) return null;
  return (
    <div className="mt-12 px-7 md:px-14 flex flex-col gap-2 justify-center items-center">
      <HeaderLabel text="Featured" />
      <ul className="grid grid-cols-1 md:grid-cols-4 place-items-center mt-3 w-full gap-3">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
}
