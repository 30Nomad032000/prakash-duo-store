import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import categoryProductsData from '@/data/category-products.json';

export interface InventoryItem {
  size: string;
  quantity: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
  sizes: string[];
  inventory: InventoryItem[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  path: string;
}

export interface CategoryWithImages extends Category {
  images: string[];
  productCount: number;
}

const products = productsData.products as Product[];
const categories = categoriesData.categories as Category[];
const categoriesWithImages = categoriesData.categoriesWithImages as CategoryWithImages[];
const categoryProducts = categoryProductsData as Record<string, { category: Category; products: Product[] }>;

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoriesWithImages(): CategoryWithImages[] {
  return categoriesWithImages;
}

export function getCategoryProducts(categorySlug: string): Product[] {
  const data = categoryProducts[categorySlug];
  return data ? data.products : [];
}

export function getAllProducts(limit?: number): Product[] {
  if (limit) {
    return products.slice(0, limit);
  }
  return products;
}

export function getProductById(id: string): Product | null {
  return products.find(p => p.id === id) || null;
}

export function getProductsByCategory(categoryName: string): Product[] {
  return products.filter(p => p.category === categoryName);
}

export function getCategoryBySlug(slug: string): Category | null {
  return categories.find(c => c.slug === slug) || null;
}

export function getCategoryWithImages(categorySlug: string): CategoryWithImages | null {
  return categoriesWithImages.find(c => c.slug === categorySlug) || null;
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.subcategory.toLowerCase().includes(lowerQuery)
  );
}

export function getProductsInStock(): Product[] {
  return products.filter(p =>
    p.inventory.some(inv => {
      const qty = parseInt(inv.quantity) || (inv.quantity.includes('set') ? 1 : 0);
      return qty > 0;
    })
  );
}
