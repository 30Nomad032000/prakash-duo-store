import { NextResponse } from 'next/server';
import { getCategoryProducts, getAllCategories, getCategoryWithImages } from '@/lib/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const withImages = searchParams.get('withImages') === 'true';
  
  if (slug) {
    const products = getCategoryProducts(slug);
    const categories = getAllCategories();
    const category = categories.find(c => c.slug === slug);
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      category,
      products
    });
  }
  
  const categories = getAllCategories();
  
  if (withImages) {
    const categoriesWithImages = categories.map(cat => {
      const catWithImages = getCategoryWithImages(cat.slug);
      return catWithImages ? catWithImages : { ...cat, images: [], productCount: 0 };
    }).filter(cat => cat.images.length > 0);
    return NextResponse.json(categoriesWithImages);
  }
  
  return NextResponse.json(categories);
}
