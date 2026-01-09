import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductDetails from "@/components/ProductDetails";
import { getProductById, getAllProducts } from "@/lib/products";
import ProductImageGallery from "@/components/ProductImageGallery";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductById(params.id);
  const allProducts = getAllProducts();
  
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
            <Link
              href="/categories"
              className="inline-flex items-center bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
            >
              Browse All Products
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
        <section className="py-3 md:py-4 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm flex items-center">
              <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <span className="mx-2 text-gray-300">/</span>
              <Link href="/categories" className="text-gray-500 hover:text-gray-900 transition-colors">
                Categories
              </Link>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>
          </div>
        </section>

        <section className="py-12 md:py-16">
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
        </section>

        <section className="py-16 md:py-20 bg-white border-t border-stone-200">
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
              {allProducts.slice(0, 4).map((prod) => (
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
        </section>

        <section className="py-16 md:py-20 bg-amber-50 border-y border-amber-200">
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
