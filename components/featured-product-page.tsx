import HeaderLabel from './header-label';
import ProductCard from './product-card';
import { getFeaturedProducts } from '@/lib/payload';

export default async function FeaturedProductsPage() {
  const products = await getFeaturedProducts();
  return (
    <div className="mt-12 px-7 md:px-14 flex flex-col gap-2 justify-center items-center">
      <HeaderLabel text="Featured" />
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 place-items-center w-full">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
}
