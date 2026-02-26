/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { RichText } from '@payloadcms/richtext-lexical/react';
import Image from 'next/image';
import { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { discountPercent } from '@/lib/discount';
import { getProductStock, isInStock } from '@/lib/stock';

interface ProductDetailProps {
  product: any;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  if (!product) return null;

  const price = selectedVariant?.price ?? product.price;

  // Group variants by name (e.g. Size: [S, M, L], Color: [Red, Blue])
  const variantGroups = product.variants?.reduce((acc: any, variant: any) => {
    if (!acc[variant.name]) acc[variant.name] = [];
    acc[variant.name].push(variant);
    return acc;
  }, {});

  return (
    <div className="pt-7 px-4 md:px-14 min-h-screen w-full flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 w-full">
        {/* Left — Images */}
        <div>
          {product.image.length > 1 ? (
            <Carousel className="w-full rounded-md border-2 border-black shadow-[6px_6px_0px_#000]">
              <CarouselContent>
                {product.image.map((image: any) => (
                  <CarouselItem key={image.id}>
                    <div className="relative w-full h-[420px]">
                      <Image
                        src={image.imageUrl.url}
                        alt={image.alt || product.name}
                        fill
                        unoptimized
                        className="object-cover rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 border-2 border-black" />
              <CarouselNext className="right-2 border-2 border-black" />
            </Carousel>
          ) : (
            <div className="relative w-full h-[420px] border-2 border-black shadow-[6px_6px_0px_#000] overflow-hidden">
              <Image src={product.image[0].imageUrl.url} alt={product.name} fill unoptimized className="object-cover" />
            </div>
          )}
        </div>

        {/* Right — Details */}
        <div className="flex flex-col gap-4">
          {/* Category + Name */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {product.category?.name}
            </span>
            <h1 className="text-3xl font-black leading-tight mt-1">{product.name}</h1>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 border-y-2 border-black py-3">
            <span className="text-3xl font-black">₹{price}</span>
            {product.comparePrice && (
              <>
                <span className="text-lg line-through text-muted-foreground">₹{product.comparePrice}</span>
                <span className="bg-black text-white text-xs font-black px-2 py-1">
                  -{discountPercent(product.comparePrice, product.price)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Variants */}
          {variantGroups &&
            Object.entries(variantGroups).map(([groupName, variants]: any) => (
              <div key={groupName}>
                <p className="text-sm font-bold uppercase mb-2">{groupName}</p>
                <div className="flex gap-2 flex-wrap">
                  {variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(selectedVariant?.id === variant.id ? null : variant)}
                      disabled={variant.stock === 0}
                      className={`border-2 border-black px-4 py-1 font-bold text-sm transition-all
                      ${
                        selectedVariant?.id === variant.id
                          ? 'bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]'
                          : 'shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]'
                      }
                      ${variant.stock === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    >
                      {variant.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          {/* Stock */}
          {/* <p className={`text-sm font-bold ${product.stock === 0 ? 'text-red-500' : 'text-green-600'}`}>
            {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
          </p> */}
          <p
            className={`text-sm font-bold ${isInStock(product, selectedVariant?.id) ? 'text-green-600' : 'text-red-500'}`}
          >
            {isInStock(product, selectedVariant?.id) ? `${getProductStock(product)} in stock` : 'Out of stock'}
          </p>

          {/* Add to cart */}
          <Button
            disabled={!isInStock(product, selectedVariant?.id)}
            className="w-full border-2 border-black bg-black text-white font-black py-6 text-base shadow-[4px_4px_0px_#555] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart →'}
          </Button>

          {/* Description */}
          <div className="border-t-2 border-black pt-4">
            <p className="text-xs font-bold uppercase tracking-widest mb-2">Description</p>
            <RichText data={product.description} className="text-sm leading-relaxed" />
          </div>
        </div>
      </div>
    </div>
  );
}
