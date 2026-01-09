import { NextResponse } from 'next/server';
import categoriesData from '@/data/categories.json';
import categoryProductsData from '@/data/category-products.json';

interface Category {
  id: string;
  name: string;
  slug: string;
  path: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

interface CategoryData {
  category: Category;
  products: Product[];
}

interface CategoriesData {
  categories: Category[];
  categoriesWithImages: (Category & { images: string[]; productCount: number })[];
}

interface CategoryProductsData {
  [key: string]: CategoryData;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const withImages = searchParams.get('withImages') === 'true';
  
  if (slug) {
    const categoryData = (categoryProductsData as CategoryProductsData)[slug];
    
    if (!categoryData) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      category: categoryData.category,
      products: categoryData.products
    });
  }
  
  if (withImages) {
    return NextResponse.json((categoriesData as CategoriesData).categoriesWithImages);
  }
  
  return NextResponse.json((categoriesData as CategoriesData).categories);
}
