import HeaderLabel from './header-label';
import ProductCard from './product-card';
import { getFeaturedProducts } from '@/lib/payload';
import { Marquee } from './ui/marquee';
import { Suspense } from 'react';
import { Skeleton } from './ui/skeleton';

export default async function FeaturedProductsPage() {
  const products = await getFeaturedProducts();

  if (!products) return null;
  return (
    <div className="mt-12 px-7 md:px-14 flex flex-col gap-2 justify-center items-center">
      <HeaderLabel text="Featured" />

      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <ul className="flex mt-3 w-full gap-3">
          <Marquee>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Marquee>
        </ul>
      </Suspense>
    </div>
  );
}

function FeaturedProductsSkeleton() {
  return (
    <div className="flex mt-3 w-full justify-center gap-3">
      <Skeleton className="block h-75 w-72 border-2 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-150 bg-secondary-background rounded-md" />
      <Skeleton className="block h-75 w-72 border-2 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-150 bg-secondary-background rounded-md" />
      <Skeleton className="block h-75 w-72 border-2 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-150 bg-secondary-background rounded-md" />
      <Skeleton className="block h-75 w-72 border-2 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-150 bg-secondary-background rounded-md" />
    </div>
  );
}
