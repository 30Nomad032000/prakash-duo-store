import { NextResponse } from 'next/server';
import { getAllCategories, getCategoryProducts, getCategoryWithImages } from '@/lib/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const withImages = searchParams.get('withImages') === 'true';

  if (slug) {
    const categories = getAllCategories();
    const category = categories.find(c => c.slug === slug);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const products = getCategoryProducts(slug);

    return NextResponse.json({
      category,
      products
    });
  }

  if (withImages) {
    const categories = getAllCategories();
    const categoriesWithImages = categories.map(cat => {
      const withImgs = getCategoryWithImages(cat.slug);
      return withImgs || { ...cat, images: [], productCount: 0 };
    });
    return NextResponse.json(categoriesWithImages);
  }

  return NextResponse.json(getAllCategories());
}
