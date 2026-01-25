import { NextResponse } from 'next/server';
import { getAllProducts, getProductById } from '@/lib/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get('id')) {
    const product = getProductById(searchParams.get('id')!);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  }

  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  const products = getAllProducts(limit);

  return NextResponse.json(products);
}
