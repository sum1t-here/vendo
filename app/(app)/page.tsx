import HomePage from '@/components/home-page';
import GetByCategories from '@/components/get-by-categories';
import FeaturedProductsPage from '@/components/featured-product-page';

export default function Home() {
  return (
    <div>
      <HomePage />
      <GetByCategories />
      <FeaturedProductsPage />
    </div>
  );
}
