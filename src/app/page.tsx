'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import HeroCarousel from "@/components/HeroCarousel";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  path: string;
  images: string[];
  productCount: number;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/categories?withImages=true').then(r => r.json()),
          fetch('/api/products?limit=8').then(r => r.json())
        ]);
        setCategories(categoriesRes);
        setProducts(productsRes);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const featuredCategories = categories.slice(0, 6);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      
      <main>
        <section className="relative bg-white border-b border-stone-200">
          <div className="bg-amber-600 text-white text-center py-3 px-4 text-sm font-medium">
            🚚 Free Shipping on all orders above ₹999 | Made with love in India
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="text-amber-700 font-semibold text-sm tracking-wide uppercase">
                    Handcrafted Excellence
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight">
                  Bangles by
                  <span className="block mt-2 text-gray-800">Prakash Duo</span>
                </h1>
                
                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md">
                  Each bangle tells a story of tradition and elegance. 
                  Crafted with precision by skilled artisans, bringing you the finest quality 
                  bangles for every special occasion in your life.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/categories" className="inline-flex items-center bg-gray-900 text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors">
                    Shop Collection
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link href="/about" className="inline-flex items-center border-2 border-gray-900 text-gray-900 px-8 py-4 font-medium hover:bg-gray-900 hover:text-white transition-colors">
                    Our Story
                  </Link>
                </div>
                
                <div className="flex items-center gap-8 pt-6 border-t border-stone-200">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">1000+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Happy Customers</div>
                  </div>
                  <div className="w-px h-10 bg-stone-200"></div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Unique Designs</div>
                  </div>
                  <div className="w-px h-10 bg-stone-200"></div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Handmade in India</div>
                  </div>
                </div>
              </div>
              
              <div className="relative bg-gradient-to-br from-stone-100 to-amber-50 p-8 rounded-sm">
                <HeroCarousel products={products} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
                Shop by Category
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our thoughtfully curated collection of traditional and contemporary bangles
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {featuredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden border border-stone-200 hover:border-amber-400 transition-colors shadow-sm hover:shadow-md">
                    <div className="aspect-square relative overflow-hidden bg-stone-50">
                      <Image
                        src={category.images[0] || ''}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-amber-700 transition-colors">
                        {category.name}
                      </h3>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gradient-to-b from-stone-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
                Customer Love
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Real reviews from real customers who love their bangles
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Priya Sharma",
                  rating: 5,
                  text: "Absolutely stunning bangles! The quality exceeded my expectations. Will definitely order again.",
                  days: "3 days ago"
                },
                {
                  name: "Anjali Patel",
                  rating: 5,
                  text: "Beautiful craftsmanship. The packaging was perfect and delivery was super fast. Thank you!",
                  days: "1 week ago"
                },
                {
                  name: "Meera Krishnan",
                  rating: 5,
                  text: "My sister loved the gift. The bangles look exactly like the pictures. Highly recommend!",
                  days: "2 weeks ago"
                }
              ].map((review, index) => (
                <Card key={index} className="p-6 bg-white border border-stone-200">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">{review.text}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{review.name}</span>
                    <span className="text-xs text-gray-500">{review.days}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
                New Arrivals
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Fresh additions to our collection
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  images={product.images}
                  category={product.category}
                />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/categories" className="inline-flex items-center bg-gray-900 text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors">
                View All Products
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-amber-50 border-y border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="text-3xl">✨</div>
                <h3 className="text-lg font-medium text-gray-900">Handcrafted with Love</h3>
                <p className="text-gray-600 text-sm">
                  Each piece is carefully crafted by skilled artisans using traditional techniques
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="text-3xl">🇮🇳</div>
                <h3 className="text-lg font-medium text-gray-900">Proudly Made in India</h3>
                <p className="text-gray-600 text-sm">
                  Supporting local artisans and celebrating Indian craftsmanship
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="text-3xl">🎁</div>
                <h3 className="text-lg font-medium text-gray-900">Ready to Gift</h3>
                <p className="text-gray-600 text-sm">
                  Beautiful packaging included, perfect for gifting loved ones
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  question: "How do I place an order?",
                  answer: "Simply browse our collection, select your favorite bangles, and add to cart. Complete checkout with secure payment options."
                },
                {
                  question: "How long will delivery take?",
                  answer: "Orders are typically delivered within 5-7 business days across India. International orders may take 10-14 business days."
                },
                {
                  question: "What if the size doesn't fit?",
                  answer: "We offer easy returns and exchanges within 7 days of delivery. Contact our support team for assistance."
                },
                {
                  question: "Do you ship internationally?",
                  answer: "Yes! We ship to most countries worldwide with standard and express shipping options."
                }
              ].map((faq, index) => (
                <Card key={index} className="border border-stone-200 p-6">
                  <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
