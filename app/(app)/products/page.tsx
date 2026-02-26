import { getProducts } from '@/lib/payload';
import ProductCard from '@/components/product-card';

export default async function ProductsPage() {
  const products = await getProducts();

  if (!products) {
    return <div>No products found</div>;
  }
  return (
    <div className="pt-7 px-7 md:px-14 min-h-screen w-full">
      <ul className="grid grid-cols-1 md:grid-cols-4 gap-2 place-items-center w-full">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
}
