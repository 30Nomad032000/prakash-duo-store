import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { getAllProducts } from "@/lib/products";

export default function CollectionsPage() {
  const products = getAllProducts(12);
  
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      
      <main>
        <section className="py-16 md:py-24 bg-gradient-to-b from-amber-50 to-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block bg-amber-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 mb-4 rounded-full">
                Special Collections
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                Curated for You
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Explore our handpicked collections featuring the finest bangles for every occasion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                  <Image
                    src="/assets/AD Stone bangles/AD stone brick ruby stone/1.jpg"
                    alt="Best Sellers"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="text-white">
                        <h3 className="text-2xl font-bold mb-1">Best Sellers</h3>
                        <p className="text-sm opacity-90">Our most loved designs</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4">
                    Discover the bangles that have won the hearts of our customers across India.
                  </p>
                  <Link
                    href="/categories"
                    className="inline-flex items-center text-amber-700 font-medium text-sm hover:text-amber-800"
                  >
                    Shop Collection
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </Card>

              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-rose-100 to-pink-100">
                  <Image
                    src="/assets/antique golden Bangles/antique flower rode/1.jpg"
                    alt="New Arrivals"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="text-white">
                        <h3 className="text-2xl font-bold mb-1">New Arrivals</h3>
                        <p className="text-sm opacity-90">Fresh from artisans</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4">
                    Latest additions to our collection, crafted with modern elegance.
                  </p>
                  <Link
                    href="/categories"
                    className="inline-flex items-center text-amber-700 font-medium text-sm hover:text-amber-800"
                  >
                    Shop Collection
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </Card>

              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-stone-200 to-amber-200">
                  <Image
                    src="/assets/bracelet bangle/drop shaped bangle/1.jpg"
                    alt="Traditional"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="text-white">
                        <h3 className="text-2xl font-bold mb-1">Traditional</h3>
                        <p className="text-sm opacity-90">Timeless classics</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4">
                    Explore our traditional designs that have been cherished for generations.
                  </p>
                  <Link
                    href="/categories"
                    className="inline-flex items-center text-amber-700 font-medium text-sm hover:text-amber-800"
                  >
                    Shop Collection
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Handpicked bangles from our exclusive collections
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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
              <Link
                href="/categories"
                className="inline-flex items-center bg-gray-900 text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors rounded"
              >
                View All Products
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-amber-50 border-y border-amber-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                Why Our Collections?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl">1</span>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">Handpicked Selection</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Every collection is carefully curated by our team to ensure you get only the finest bangles.
                </p>
              </div>
              
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl">2</span>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">Artisan Crafted</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Each piece is handcrafted by skilled artisans using traditional techniques passed down through generations.
                </p>
              </div>
              
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl">3</span>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">Quality Assured</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Every bangle goes through strict quality checks to ensure you receive nothing but the best.
                </p>
              </div>
              
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl">4</span>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">Exclusive Designs</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Many pieces in our collections are limited edition or exclusive designs you won&apos;t find elsewhere.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
