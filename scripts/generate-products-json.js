const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../public/assets');
const OUTPUT_FILE = path.join(__dirname, '../public/products.json');

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function generateProductsJson() {
  const products = [];
  
  // Get all categories (directories)
  const categories = fs.readdirSync(ASSETS_DIR, { withFileTypes: true })
    .filter(item => item.isDirectory() && item.name !== 'logo')
    .map(item => ({
      id: slugify(item.name),
      name: item.name,
      path: item.name
    }));

  // Get all products
  categories.forEach(category => {
    const categoryPath = path.join(ASSETS_DIR, category.path);
    
    try {
      const productDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(item => item.isDirectory());
      
      productDirs.forEach(prodDir => {
        const productPath = path.join(categoryPath, prodDir.name);
        
        try {
          const files = fs.readdirSync(productPath);
          const images = files
            .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
            .sort((a, b) => {
              const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
              const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
              return aNum - bNum;
            })
            .slice(0, 4)
            .map(f => `/assets/${category.path}/${prodDir.name}/${f}`);
          
          if (images.length > 0) {
            const productId = slugify(prodDir.name);
            
            products.push({
              id: productId,
              name: prodDir.name,
              price: Math.floor(Math.random() * (5000 - 500 + 1) + 500),
              images: images,
              category: category.name
            });
          }
        } catch (err) {
          console.error(`Error reading product ${prodDir.name}:`, err.message);
        }
      });
    } catch (err) {
      console.error(`Error reading category ${category.name}:`, err.message);
    }
  });

  return {
    categories: categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.id
    })),
    products: products
  };
}

try {
  console.log('Generating products.json...');
  const data = generateProductsJson();
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  
  console.log(`✅ Generated products.json with ${data.products.length} products and ${data.categories.length} categories`);
  console.log(`📁 File saved to: ${OUTPUT_FILE}`);
} catch (error) {
  console.error('❌ Error generating products.json:', error.message);
  process.exit(1);
}
