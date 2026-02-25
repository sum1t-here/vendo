import { getProductsByCategory } from '@/lib/payload';
import ProductCard from './product-card';

interface Props {
  category: string;
}

export default async function ProductsPage({ category }: Props) {
  const products = await getProductsByCategory(category);
  return (
    <div className="pt-7 px-7 md:px-14 min-h-screen w-full">
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 place-items-center w-full">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
}
