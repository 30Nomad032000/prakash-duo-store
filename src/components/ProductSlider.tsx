"use client";

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

interface ProductSliderProps {
  products: Product[];
  title?: string;
}

export default function ProductSlider({ products, title }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
          {title}
        </h2>
      )}
      
      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex-shrink-0 w-[calc(100%-16px)] sm:w-[calc(50%-16px)] lg:w-[calc(25%-16px)]"
            >
              <div className="group/product relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg hover:border-gold">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={product.images[0] || '/placeholder-product.webp'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/product:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-charcoal text-sm line-clamp-2 mb-2 group-hover/product:text-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-rose-gold font-semibold">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gold hover:text-white z-10"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gold hover:text-white z-10"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
