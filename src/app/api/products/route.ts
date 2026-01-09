import { NextResponse } from 'next/server';
import productsData from '@/data/products.json';
import { Product } from '@/data/products.d';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  if (searchParams.get('id')) {
    const product = productsData.products.find(
      (p: Product) => p.id === searchParams.get('id')
    );
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  }
  
  const products = productsData.products;
  return NextResponse.json(products);
}
