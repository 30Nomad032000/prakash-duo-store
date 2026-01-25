import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');

const foldersToConvert = [
  'design mix bangles',
  'Glass Bangles/plain water bangle'
];

async function convertImagesInFolder(folderPath: string): Promise<number> {
  let convertedCount = 0;

  if (!fs.existsSync(folderPath)) {
    console.log(`Folder not found: ${folderPath}`);
    return 0;
  }

  const items = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(folderPath, item.name);

    if (item.isDirectory()) {
      convertedCount += await convertImagesInFolder(itemPath);
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();

      if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
        continue;
      }

      const baseName = path.basename(item.name, ext);
      const webpPath = path.join(folderPath, `${baseName}.webp`);

      if (fs.existsSync(webpPath)) {
        console.log(`  Skipping (webp exists): ${item.name}`);
        continue;
      }

      try {
        await sharp(itemPath)
          .webp({ quality: 85 })
          .toFile(webpPath);

        console.log(`  Converted: ${item.name} -> ${baseName}.webp`);
        convertedCount++;

        fs.unlinkSync(itemPath);
        console.log(`  Deleted original: ${item.name}`);
      } catch (error) {
        console.error(`  Error converting ${item.name}:`, error);
      }
    }
  }

  return convertedCount;
}

async function deleteDocxFiles(folderPath: string): Promise<number> {
  let deletedCount = 0;

  if (!fs.existsSync(folderPath)) {
    return 0;
  }

  const items = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(folderPath, item.name);

    if (item.isDirectory()) {
      deletedCount += await deleteDocxFiles(itemPath);
    } else if (item.isFile() && item.name.endsWith('.docx')) {
      fs.unlinkSync(itemPath);
      console.log(`  Deleted docx: ${item.name}`);
      deletedCount++;
    }
  }

  return deletedCount;
}

async function main() {
  console.log('Converting images to WebP format...\n');

  let totalConverted = 0;
  let totalDocxDeleted = 0;

  for (const folder of foldersToConvert) {
    const fullPath = path.join(ASSETS_DIR, folder);
    console.log(`\nProcessing: ${folder}`);
    console.log('='.repeat(50));

    const converted = await convertImagesInFolder(fullPath);
    totalConverted += converted;

    const docxDeleted = await deleteDocxFiles(fullPath);
    totalDocxDeleted += docxDeleted;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Done! Converted ${totalConverted} images to WebP`);
  console.log(`Deleted ${totalDocxDeleted} .docx files`);
}

main().catch(console.error);
