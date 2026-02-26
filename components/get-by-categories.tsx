import { getCategories } from '@/lib/payload';
import Link from 'next/link';
import HeaderLabel from './header-label';
import CategoryCard from './category-card';

const categoryConfig = {
  male: {
    label: 'Men',
    accent: 'bg-[#2E797B]',
    tagline: 'Built for him',
    emoji: '♂',
  },
  female: {
    label: 'Women',
    accent: 'bg-[#f4a0b5]',
    tagline: 'Made for her',
    emoji: '♀',
  },
  unisex: {
    label: 'Unisex',
    accent: 'bg-[#fde68a] text-black',
    tagline: 'Worn by all',
    emoji: '⚥',
  },
};

export default async function GetByCategories() {
  const categories = await getCategories();
  return (
    <div className="mt-12 px-7 md:px-14 flex flex-col gap-2 justify-center items-center">
      <HeaderLabel text="Shop By Category" />
      <ul className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 place-items-center w-full">
        {categories.map(category => {
          const config = categoryConfig[category.slug as keyof typeof categoryConfig];

          if (!config) return null;

          return (
            <Link href={`/products/category/${category.slug}`} key={category.id} className="w-full">
              <CategoryCard config={config} />
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
