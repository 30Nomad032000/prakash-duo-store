import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];

async function findImages(dir: string): Promise<string[]> {
  const images: string[] = [];

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      images.push(...await findImages(fullPath));
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        images.push(fullPath);
      }
    }
  }

  return images;
}

async function convertToWebp(imagePath: string): Promise<void> {
  const dir = path.dirname(imagePath);
  const name = path.basename(imagePath, path.extname(imagePath));
  const webpPath = path.join(dir, `${name}.webp`);

  // Skip if webp already exists
  if (fs.existsSync(webpPath)) {
    console.log(`Skipping (already exists): ${webpPath}`);
    return;
  }

  try {
    await sharp(imagePath)
      .webp({ quality: 80 })
      .toFile(webpPath);

    console.log(`Converted: ${imagePath} -> ${webpPath}`);

    // Delete original file after successful conversion
    fs.unlinkSync(imagePath);
    console.log(`Deleted original: ${imagePath}`);
  } catch (error) {
    console.error(`Failed to convert ${imagePath}:`, error);
  }
}

async function main() {
  console.log('Finding images in public directory...');
  const images = await findImages(PUBLIC_DIR);
  console.log(`Found ${images.length} images to convert\n`);

  let converted = 0;
  let failed = 0;

  for (const image of images) {
    try {
      await convertToWebp(image);
      converted++;
    } catch {
      failed++;
    }
  }

  console.log(`\nConversion complete!`);
  console.log(`Converted: ${converted}`);
  console.log(`Failed: ${failed}`);
}

main().catch(console.error);
