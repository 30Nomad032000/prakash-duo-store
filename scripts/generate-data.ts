import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const PRODUCT_DATA_PATH = path.join(process.cwd(), 'src/data', 'products copy.json');
const OUTPUT_DIR = path.join(process.cwd(), 'src/data');

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

interface InventoryItem {
  size: string;
  quantity: string;
}

// New format from products copy.json
interface RawProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  folder: string;
  images: string[];
  sizes: string[];
  quantity: number;
}

interface RawDataFile {
  store: {
    name: string;
    description: string;
  };
  categories: Array<{
    name: string;
    slug: string;
    productCount: number;
    subcategories: string[] | null;
  }>;
  products: RawProduct[];
  metadata: {
    totalProducts: number;
    totalCategories: number;
    generatedAt: string;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
  sizes: string[];
  inventory: InventoryItem[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  path: string;
}

interface CategoryWithImages extends Category {
  images: string[];
  productCount: number;
}

function getProductImages(folderPath: string): string[] {
  // Convert Windows path separators to forward slashes for URL
  // Images are in public/assets/, so prefix the folder path
  const normalizedPath = 'assets/' + folderPath.replace(/\\/g, '/');
  const fullPath = path.join(PUBLIC_DIR, 'assets', folderPath);

  try {
    if (!fs.existsSync(fullPath)) {
      console.warn(`Warning: Folder not found: ${fullPath}`);
      return [];
    }

    const files = fs.readdirSync(fullPath);
    return files
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort((a, b) => {
        const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
        const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
        return aNum - bNum;
      })
      .map(f => {
        // URL-encode each path segment to handle spaces and special characters
        const encodedPath = normalizedPath
          .split('/')
          .map(segment => encodeURIComponent(segment))
          .join('/');
        return `/${encodedPath}/${encodeURIComponent(f)}`;
      });
  } catch (error) {
    console.warn(`Warning: Could not read folder: ${fullPath}`);
    return [];
  }
}

function main() {
  console.log('Generating static data files from products copy.json...');

  // Read the product data JSON (new format)
  const rawData = fs.readFileSync(PRODUCT_DATA_PATH, 'utf-8');
  const dataFile: RawDataFile = JSON.parse(rawData);
  const rawProducts = dataFile.products;

  console.log(`Found ${rawProducts.length} products in products copy.json`);

  // Process products and extract categories
  const categoryMap = new Map<string, Category>();
  const allProducts: Product[] = [];

  rawProducts.forEach(raw => {
    // Use folder field to scan for actual images on disk
    const images = getProductImages(raw.folder);

    if (images.length === 0) {
      console.warn(`Skipping product with no images: ${raw.name}`);
      return;
    }

    // Create category if not exists
    const categorySlug = slugify(raw.category);
    if (!categoryMap.has(categorySlug)) {
      categoryMap.set(categorySlug, {
        id: categorySlug,
        name: raw.category,
        slug: categorySlug,
        path: raw.category
      });
    }

    // Convert quantity to inventory format
    const inventory: InventoryItem[] = raw.sizes.map(size => ({
      size,
      quantity: String(raw.quantity)
    }));

    const product: Product = {
      id: raw.id || slugify(raw.name),
      name: raw.name,
      price: raw.price,
      images: images.slice(0, 4),
      category: raw.category,
      subcategory: raw.subcategory || '',
      sizes: raw.sizes,
      inventory
    };

    allProducts.push(product);
  });

  const categories = Array.from(categoryMap.values());

  // Build categories with images
  const categoriesWithImages: CategoryWithImages[] = categories.map(cat => {
    const categoryProducts = allProducts.filter(p => p.category === cat.name);
    const allImages = categoryProducts.flatMap(p => p.images);

    return {
      ...cat,
      images: allImages.slice(0, 5),
      productCount: categoryProducts.length
    };
  }).filter(cat => cat.productCount > 0);

  // Build category products map
  const categoryProductsData: Record<string, { category: Category; products: Product[] }> = {};
  categories.forEach(cat => {
    const products = allProducts.filter(p => p.category === cat.name);
    if (products.length > 0) {
      categoryProductsData[cat.slug] = {
        category: cat,
        products
      };
    }
  });

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write output files
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'products.json'),
    JSON.stringify({ products: allProducts }, null, 2)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'categories.json'),
    JSON.stringify({ categories, categoriesWithImages }, null, 2)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'category-products.json'),
    JSON.stringify(categoryProductsData, null, 2)
  );

  console.log(`\n✓ Generated products.json with ${allProducts.length} products`);
  console.log(`✓ Generated categories.json with ${categories.length} categories`);
  console.log(`✓ Generated category-products.json with ${Object.keys(categoryProductsData).length} categories`);

  // Print category breakdown
  console.log('\nProducts per category:');
  categories.forEach(cat => {
    const count = allProducts.filter(p => p.category === cat.name).length;
    console.log(`  - ${cat.name}: ${count} products`);
  });
}

main();
