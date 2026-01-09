import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { getAllCategories, getCategoryWithImages } from "@/lib/products";

export default function CategoriesPage() {
  const categories = getAllCategories();
  
  const categoriesWithImages = categories.map(cat => {
    const catWithImages = getCategoryWithImages(cat.slug);
    return catWithImages ? catWithImages : { ...cat, images: [], productCount: 0 };
  }).filter(cat => cat.images.length > 0);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      
      <main>
        <section className="py-16 md:py-24 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm mb-8">
              <ol className="flex items-center space-x-2 text-gray-500">
                <li>
                  <Link href="/" className="hover:text-gray-900">Home</Link>
                </li>
                <li>/</li>
                <li className="text-gray-900 font-medium">All Categories</li>
              </ol>
            </nav>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Shop by Category
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mb-8">
              Explore our complete collection of handcrafted bangles, from traditional designs to contemporary styles
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500 pb-6 border-b border-stone-200">
              <span>{categoriesWithImages.length} Categories</span>
              <span className="w-px h-4 bg-stone-300"></span>
              <span>Showing all</span>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {categoriesWithImages.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden border border-stone-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-lg bg-white">
                    <div className="aspect-[4/5] relative overflow-hidden bg-stone-50">
                      <Image
                        src={category.images[0] || ''}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3">
                          <span className="text-amber-700 font-medium text-sm">
                            {category.productCount} Products
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 border-t border-stone-100">
                      <h2 className="text-lg font-medium text-gray-900 group-hover:text-amber-700 transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {category.productCount} designs available
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-amber-50 border-y border-amber-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="text-3xl">📦</div>
                <h3 className="text-lg font-medium text-gray-900">Secure Packaging</h3>
                <p className="text-gray-600 text-sm">
                  Every bangle is carefully packed to ensure safe delivery
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="text-3xl">🚚</div>
                <h3 className="text-lg font-medium text-gray-900">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">
                  Orders shipped within 24 hours, delivered in 5-7 business days
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="text-3xl">💎</div>
                <h3 className="text-lg font-medium text-gray-900">Quality Assured</h3>
                <p className="text-gray-600 text-sm">
                  Each piece goes through strict quality checks before shipping
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
