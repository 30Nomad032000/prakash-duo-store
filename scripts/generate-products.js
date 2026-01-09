const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../public/assets');
const OUTPUT_FILE = path.join(__dirname, '../src/data/products.json');

// Helper to slugify strings
const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

function getProducts() {
  const categories = [];
  const items = fs.readdirSync(ASSETS_DIR, { withFileTypes: true });

  items.forEach(item => {
    if (item.isDirectory() && item.name !== 'logo') {
      const categoryName = item.name;
      const categorySlug = slugify(categoryName);
      const categoryPath = path.join(ASSETS_DIR, item.name);
      
      const categoryData = {
        id: categorySlug,
        name: categoryName,
        products: []
      };

      // Read products in this category
      const products = fs.readdirSync(categoryPath, { withFileTypes: true });
      
      products.forEach(prod => {
        if (prod.isDirectory()) {
          const productName = prod.name;
          const productSlug = slugify(productName);
          const productPath = path.join(categoryPath, productName);
          
          // Get images
          const files = fs.readdirSync(productPath);
          const images = files
            .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
            .map(f => `/assets/${item.name}/${prod.name}/${f}`);

          if (images.length > 0) {
            categoryData.products.push({
              id: productSlug,
              name: productName,
              price: Math.floor(Math.random() * (3000 - 500 + 1) + 500), // Random price
              images: images,
              category: categoryName
            });
          }
        }
      });

      if (categoryData.products.length > 0) {
        categories.push(categoryData);
      }
    }
  });

  return categories;
}

const data = getProducts();
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
console.log(`Generated ${data.length} categories with products.`);
