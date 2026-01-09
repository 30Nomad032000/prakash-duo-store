import fs from 'fs';
import path from 'path';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

const ASSETS_DIR = path.join(process.cwd(), 'public/assets');

export function getAllCategories() {
  const items = fs.readdirSync(ASSETS_DIR, { withFileTypes: true });
  const categories = items
    .filter(item => item.isDirectory() && item.name !== 'logo')
    .map(item => ({
      id: slugify(item.name),
      name: item.name,
      slug: slugify(item.name),
      path: item.name
    }))
    .filter(cat => {
      const catPath = path.join(ASSETS_DIR, cat.path);
      const products = fs.readdirSync(catPath, { withFileTypes: true });
      return products.some(p => p.isDirectory());
    });

  return categories;
}

export function getCategoryProducts(categorySlug: string) {
  const categories = getAllCategories();
  const category = categories.find(c => c.slug === categorySlug);
  
  if (!category) return [];
  
  const categoryPath = path.join(ASSETS_DIR, category.path);
  const products = fs.readdirSync(categoryPath, { withFileTypes: true });
  
  return products
    .filter(prod => prod.isDirectory())
    .map(prod => {
      const productPath = path.join(categoryPath, prod.name);
      const files = fs.readdirSync(productPath);
      const images = files
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .sort((a, b) => {
          const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
          const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
          return aNum - bNum;
        })
        .map(f => `/assets/${category.path}/${prod.name}/${f}`);

      return {
        id: slugify(prod.name),
        name: prod.name,
        price: Math.floor(Math.random() * (5000 - 500 + 1) + 500),
        images: images.slice(0, 4),
        category: category.name
      };
    })
    .filter(p => p.images.length > 0);
}

export function getAllProducts(limit?: number) {
  const categories = getAllCategories();
  let allProducts: Product[] = [];
  
  categories.forEach(category => {
    const products = getCategoryProducts(category.slug);
    allProducts = [...allProducts, ...products];
  });
  
  if (limit) {
    allProducts = allProducts.slice(0, limit);
  }
  
  return allProducts;
}

export function getProductById(id: string): Product | null {
  const categories = getAllCategories();
  
  for (const category of categories) {
    const categoryPath = path.join(ASSETS_DIR, category.path);
    const products = fs.readdirSync(categoryPath, { withFileTypes: true });
    
    for (const prod of products) {
      if (prod.isDirectory() && slugify(prod.name) === id) {
        const productPath = path.join(categoryPath, prod.name);
        const files = fs.readdirSync(productPath);
        const images = files
          .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
          .sort((a, b) => {
            const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
            const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
            return aNum - bNum;
          })
          .map(f => `/assets/${category.path}/${prod.name}/${f}`);
        
        return {
          id: slugify(prod.name),
          name: prod.name,
          price: Math.floor(Math.random() * (5000 - 500 + 1) + 500),
          images: images.slice(0, 4),
          category: category.name
        };
      }
    }
  }
  
  return null;
}

export function getCategoryWithImages(categorySlug: string) {
  const categories = getAllCategories();
  const category = categories.find(c => c.slug === categorySlug);
  
  if (!category) return null;
  
  const categoryPath = path.join(ASSETS_DIR, category.path);
  const products = fs.readdirSync(categoryPath, { withFileTypes: true });
  
  const allImages: string[] = [];
  
  products.forEach(prod => {
    if (prod.isDirectory()) {
      const productPath = path.join(categoryPath, prod.name);
      const files = fs.readdirSync(productPath);
      const images = files
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .map(f => `/assets/${category.path}/${prod.name}/${f}`);
      allImages.push(...images);
    }
  });
  
  return {
    ...category,
    images: allImages.slice(0, 5),
    productCount: allImages.length
  };
}

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
