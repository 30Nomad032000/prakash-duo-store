export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductsData {
  categories: Category[];
  products: Product[];
}

declare module '@/data/products.json' {
  const data: ProductsData;
  export default data;
}
