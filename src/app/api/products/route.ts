import { NextResponse } from 'next/server';
import productsData from '@/data/products.json';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

interface ProductsData {
  products: Product[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  if (searchParams.get('id')) {
    const product = (productsData as ProductsData).products.find(
      (p: Product) => p.id === searchParams.get('id')
    );
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  }
  
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  let products = (productsData as ProductsData).products;
  
  if (limit) {
    products = products.slice(0, limit);
  }
  
  return NextResponse.json(products);
}
