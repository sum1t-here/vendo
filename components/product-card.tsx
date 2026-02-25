import Image from "next/image";
import Link from "next/link";

interface Props {
  product: any;
}

export default function ProductCard({ product }: Props) {
  const imageUrl = product.image?.[0]?.imageUrl?.url;
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block border-2 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-150 bg-secondary-background w-72 rounded-md"
    >
      {/* Image */}
      <div className="relative w-full h-56 border-b-2 border-black overflow-hidden rounded-md">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}

        {/* Discount badge */}
        {discountPercent && (
          <span className="absolute top-2 left-2 bg-black text-white text-xs font-black px-2 py-1 border border-white">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {product.category?.name}
        </span>
        <h3 className="font-black text-sm leading-tight truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-black text-lg">₹{product.price}</span>
          {hasDiscount && (
            <span className="text-xs line-through text-muted-foreground">
              ₹{product.comparePrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}   