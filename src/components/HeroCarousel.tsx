"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

interface HeroCarouselProps {
  products: Product[];
}

export default function HeroCarousel({ products }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [products.length]);

  return (
    <div className="aspect-[4/5] relative overflow-hidden bg-white shadow-lg">
      {products.map((product, index) => (
        <div
          key={product.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Link href={`/product/${product.id}`} className="block w-full h-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded p-4">
                  <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">{product.category}</div>
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-lg font-bold text-amber-700 mt-1">
                    ₹{product.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-6 bg-amber-600' : 'bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
