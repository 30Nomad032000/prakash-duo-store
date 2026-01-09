import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getCategoryProducts, getAllCategories } from "@/lib/products";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: PageProps) {
  const products = getCategoryProducts(params.slug);
  const categories = getAllCategories();
  const currentCategory = categories.find(c => c.slug === params.slug);

  if (!currentCategory) {
    notFound();
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <main className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The category you&apos;re looking for doesn&apos;t exist or has no products yet.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center bg-gray-900 text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors"
            >
              Browse All Categories
            </Link>
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
        <section className="py-8 md:py-12 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm mb-6">
              <ol className="flex items-center space-x-2 text-gray-500">
                <li>
                  <Link href="/" className="hover:text-gray-900">Home</Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/categories" className="hover:text-gray-900">Categories</Link>
                </li>
                <li>/</li>
                <li className="text-gray-900 font-medium">{currentCategory.name}</li>
              </ol>
            </nav>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                  {currentCategory.name}
                </h1>
                <p className="text-gray-600 mt-2">
                  {products.length} beautiful designs to choose from
                </p>
              </div>
              
              <div className="flex gap-2 text-sm">
                <button className="px-4 py-2 border border-stone-300 text-gray-900 hover:border-amber-600 transition-colors">
                  Sort by
                </button>
                <button className="px-4 py-2 border border-stone-300 text-gray-900 hover:border-amber-600 transition-colors">
                  Filter
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {products.length > 0 ? (
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
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">
                  No products found in this category yet.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="py-12 md:py-16 bg-amber-50 border-y border-amber-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  About {currentCategory.name}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Discover our exquisite collection of {currentCategory.name.toLowerCase()}. 
                  Each piece is handcrafted with love and precision by skilled artisans, 
                  bringing you the finest quality bangles for every special occasion.
                </p>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  Why Shop With Us?
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-amber-600 text-lg">✓</span>
                    <p className="text-gray-600 text-sm">
                      100% authentic handcrafted bangles
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber-600 text-lg">✓</span>
                    <p className="text-gray-600 text-sm">
                      Premium quality at affordable prices
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber-600 text-lg">✓</span>
                    <p className="text-gray-600 text-sm">
                      Secure packaging and fast delivery
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber-600 text-lg">✓</span>
                    <p className="text-gray-600 text-sm">
                      Easy returns and exchanges
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map(category => ({
    slug: category.slug
  }));
}
