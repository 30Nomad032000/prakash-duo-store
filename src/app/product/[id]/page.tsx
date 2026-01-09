'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductDetails from '@/components/ProductDetails';
import ProductImageGallery from '@/components/ProductImageGallery';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, allProductsRes] = await Promise.all([
          fetch(`/api/products?id=${params.id}`).then(r => r.json()),
          fetch('/api/products').then(r => r.json())
        ]);
        
        if (productRes.error) {
          setProduct(null);
        } else {
          setProduct(productRes);
          
          const filteredProducts = allProductsRes.filter((p: Product) => p.id !== params.id);
          setSimilarProducts(filteredProducts.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <a
              href="/categories"
              className="inline-flex items-center bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
            >
              Browse All Products
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      
      <main>
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-3 md:py-4 bg-white border-b border-stone-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm flex items-center">
              <a href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
                Home
              </a>
              <span className="mx-2 text-gray-300">/</span>
              <a href="/categories" className="text-gray-500 hover:text-gray-900 transition-colors">
                Categories
              </a>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="py-12 md:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <ProductImageGallery images={product.images} name={product.name} />
              
              <ProductDetails
                name={product.name}
                price={product.price}
                category={product.category}
              />
            </div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="py-16 md:py-20 bg-white border-t border-stone-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
                Similar Products
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                You might also like these designs
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  name={prod.name}
                  price={prod.price}
                  images={prod.images}
                  category={prod.category}
                />
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="py-16 md:py-20 bg-amber-50 border-y border-amber-200"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
                Why Choose Us?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="text-4xl">📦</div>
                <h3 className="text-lg font-medium text-gray-900">Secure Packaging</h3>
                <p className="text-gray-600 text-sm">
                  Every bangle is carefully packed to ensure safe delivery
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="text-4xl">✨</div>
                <h3 className="text-lg font-medium text-gray-900">Handcrafted Quality</h3>
                <p className="text-gray-600 text-sm">
                  Each piece is crafted by skilled artisans using traditional techniques
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="text-4xl">🎁</div>
                <h3 className="text-lg font-medium text-gray-900">Gift Ready</h3>
                <p className="text-gray-600 text-sm">
                  Beautiful packaging included, perfect for gifting loved ones
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
