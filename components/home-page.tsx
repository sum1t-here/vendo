import Image from 'next/image';
import { Button } from './ui/button';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <section>
      {/* hero section */}
      <div className="relative pt-7 px-7 md:px-14">
        <div className="relative shadow-[6px_6px_0px_#000] rounded-xl">
          <Image
            src="/models/hero.png"
            alt="hero image"
            className="w-full h-[250px] md:h-[500px] rounded-xl object-cover"
            priority
            width={700}
            height={600}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white flex flex-col justify-center items-center w-full">
          <h1 className="md:text-8xl text-[27px]">Summer Arrival of Outfit </h1>
          <p className="md:text-xl text-[10px] mt-2 md:mt-6 font-light">
            Discover quality fashion that reflects your style and makes{' '}
          </p>
          <p className="md:text-xl text-[10px] font-light">everyday enjoyable</p>
          <div className="mt-12">
            <Link href="/products">
              <Button className="text-xs md:text-base cursor-pointer" variant="neutral">
                {' '}
                EXPLORE PRODUCT{' '}
                <div>
                  <ArrowRightIcon />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* sub hero section */}
      <div className="pt-7 px-7 md:px-14 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        <div className="w-full bg-[#FDEBD2] h-48 relative rounded-xl shadow-[6px_6px_0px_#000]">
          <Image src="/models/model1.png" alt="hero image" className="object-cover rounded-xl" priority fill />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white flex justify-between items-center w-full p-7">
            <h1 className="text-[27px] md:text-4xl">
              Where dream <br /> meets couture
            </h1>
            <Link href="/products">
              <Button className="text-xs md:text-base cursor-pointer" variant="neutral">
                {' '}
                Shop Now{' '}
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-full bg-[#FDEBD2] h-48 relative rounded-xl shadow-[6px_6px_0px_#000]">
          <Image src="/models/model2.png" alt="hero image" className="object-cover rounded-xl" priority fill />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white flex justify-between items-center w-full p-7">
            <h1 className="text-[27px] md:text-4xl">
              Enchanting styles <br />
              for every season
            </h1>
            <Link href="/products">
              <Button className="text-xs md:text-base cursor-pointer" variant="neutral">
                {' '}
                Shop Now{' '}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
