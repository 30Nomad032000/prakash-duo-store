import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.join(process.cwd(), 'public/assets');
const OUTPUT_DIR = path.join(process.cwd(), 'src/data');

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  path: string;
}

function getAllCategories() {
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

function getCategoryProducts(categorySlug: string, categories: Category[]) {
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

function getCategoryWithImages(categorySlug: string, categories: Category[]) {
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
    id: category.id,
    name: category.name,
    slug: category.slug,
    path: category.path,
    images: allImages.slice(0, 5),
    productCount: allImages.length
  };
}

function main() {
  console.log('Generating static data files...');
  
  const categories = getAllCategories();
  
  let allProducts: Product[] = [];
  categories.forEach(category => {
    const products = getCategoryProducts(category.slug, categories);
    allProducts = [...allProducts, ...products];
  });
  
  const categoriesWithImages = categories.map(cat => {
    const catWithImages = getCategoryWithImages(cat.slug, categories);
    return catWithImages || { ...cat, images: [], productCount: 0 };
  }).filter(cat => cat.images.length > 0);
  
  const productsData = {
    products: allProducts
  };
  
  const categoriesData = {
    categories,
    categoriesWithImages
  };
  
  const categoryProductsData: Record<string, { category: Category; products: Product[] }> = {};
  categories.forEach(cat => {
    const products = getCategoryProducts(cat.slug, categories);
    categoryProductsData[cat.slug] = {
      category: cat,
      products
    };
  });
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'products.json'),
    JSON.stringify(productsData, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'categories.json'),
    JSON.stringify(categoriesData, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'category-products.json'),
    JSON.stringify(categoryProductsData, null, 2)
  );
  
  console.log(`✓ Generated products.json with ${allProducts.length} products`);
  console.log(`✓ Generated categories.json with ${categories.length} categories`);
  console.log(`✓ Generated category-products.json with ${Object.keys(categoryProductsData).length} categories`);
}

main();
