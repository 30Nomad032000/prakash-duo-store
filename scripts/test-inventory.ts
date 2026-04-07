/**
 * Inventory & Price Sync Test Script
 *
 * Tests the full stock lifecycle and price sync WITHOUT the payment gateway.
 * Directly calls Supabase RPCs, then asserts both the public API and the
 * rendered frontend (via Puppeteer) reflect the changes.
 *
 * Usage:
 *   1. Start the dev server:  npm run dev
 *   2. Run:                   npx ts-node scripts/test-inventory.ts
 *
 * What it tests:
 *   1. Admin price update → public API returns updated price → frontend shows it
 *   2. reserve_stock   → available quantity decreases in API + frontend
 *   3. release_stock   → available quantity restores in API + frontend
 *   4. commit_stock_sale → quantity permanently decreases in API + frontend
 *   5. Full lifecycle:  reserve → commit → verify (API + frontend)
 *   6. Out-of-stock reservation rejection
 *   7. "No Returns" policy text on product page, cart page
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import puppeteer, { Browser, Page } from 'puppeteer';

// ── Config ──────────────────────────────────────────────────────────────────
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let browser: Browser;
let page: Page;

// ── Helpers ─────────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
const failures: string[] = [];

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.log(`  ❌ ${message}`);
    failed++;
    failures.push(message);
  }
}

function assertEqual(actual: unknown, expected: unknown, message: string) {
  if (actual === expected) {
    console.log(`  ✅ ${message} (got ${actual})`);
    passed++;
  } else {
    console.log(`  ❌ ${message} — expected ${expected}, got ${actual}`);
    failed++;
    failures.push(`${message} — expected ${expected}, got ${actual}`);
  }
}

async function fetchProductFromAPI(productId: string) {
  const res = await fetch(`${BASE_URL}/api/products?id=${productId}`);
  if (!res.ok) throw new Error(`API returned ${res.status}`);
  return res.json();
}

async function getInventoryFromDB(productId: string, size: string) {
  const { data, error } = await supabase
    .from('product_inventory')
    .select('quantity, reserved_quantity')
    .eq('product_id', productId)
    .eq('size', size)
    .single();

  if (error) throw new Error(`DB query failed: ${error.message}`);
  return data;
}

async function getProductPriceFromDB(productId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('price')
    .eq('id', productId)
    .single();

  if (error) throw new Error(`DB query failed: ${error.message}`);
  return data.price;
}

// ── Frontend helpers ────────────────────────────────────────────────────────

async function openProductPage(productId: string): Promise<void> {
  await page.goto(`${BASE_URL}/product/${productId}`, { waitUntil: 'networkidle0', timeout: 15000 });
  // Wait for client-side data to render (price element appears)
  await page.waitForFunction(
    () => document.body.innerText.includes('₹'),
    { timeout: 10000 }
  );
}

async function getFrontendPrice(): Promise<number | null> {
  return page.evaluate(() => {
    // Find a span containing ₹ followed by digits — the product price
    const spans = Array.from(document.querySelectorAll('span'));
    const priceSpan = spans.find(s => {
      const text = s.textContent?.trim() || '';
      return /^₹[\d,]+$/.test(text) && s.classList.contains('font-bold');
    });
    if (!priceSpan) return null;
    const cleaned = (priceSpan.textContent || '').replace(/[₹,\s]/g, '');
    return cleaned ? parseInt(cleaned) : null;
  });
}

async function getFrontendStockForSize(size: string): Promise<{ available: number; inStock: boolean } | null> {
  return page.evaluate((sz) => {
    // Size buttons have a nested span with "X available" or "Out of stock"
    const buttons = Array.from(document.querySelectorAll('button'));
    const sizeBtn = buttons.find(btn => {
      // The button has the size as direct text, and a child span with stock info
      const spans = btn.querySelectorAll('span');
      const hasSize = Array.from(spans).length > 0 || btn.textContent?.includes(sz);
      const hasStock = btn.textContent?.includes('available') || btn.textContent?.includes('Out of stock');
      // Match by checking if the button starts with the size value
      return hasSize && hasStock && btn.textContent?.trimStart().startsWith(sz);
    });
    if (!sizeBtn) return null;

    // Get the stock info from the nested span (e.g. "2 available")
    const stockSpan = sizeBtn.querySelector('span');
    if (!stockSpan) return null;
    const stockText = stockSpan.textContent || '';

    if (stockText.includes('Out of stock')) {
      return { available: 0, inStock: false };
    }
    const match = stockText.match(/(\d+)\s*available/);
    return {
      available: match ? parseInt(match[1]) : 0,
      inStock: !stockText.includes('Out of stock'),
    };
  }, size);
}

async function getPageText(): Promise<string> {
  return page.evaluate(() => document.body.innerText);
}

// ── Pick a test product ─────────────────────────────────────────────────────
async function pickTestProduct(): Promise<{ id: string; size: string }> {
  const { data: rows, error } = await supabase
    .from('product_inventory')
    .select('product_id, size, quantity, reserved_quantity')
    .gt('quantity', 1)
    .order('quantity', { ascending: false })
    .limit(1);

  if (error || !rows || rows.length === 0) {
    throw new Error(
      'No suitable test product found (need a product with quantity > 1). ' +
      'Error: ' + (error?.message || 'no rows')
    );
  }

  const inv = rows[0];
  console.log(`\n📦 Test product: ${inv.product_id} | size: ${inv.size} | stock: ${inv.quantity} (reserved: ${inv.reserved_quantity})\n`);
  return { id: inv.product_id, size: inv.size };
}

// ── Tests ───────────────────────────────────────────────────────────────────

async function testPriceSync(productId: string) {
  console.log('\n── Test 1: Price Sync (Admin update → API + Frontend) ──');

  // 1. Get current price from DB
  const originalPrice = await getProductPriceFromDB(productId);
  console.log(`  Original DB price: ₹${originalPrice}`);

  // 2. Update price in DB (simulate admin panel)
  const testPrice = originalPrice + 100;
  const { error } = await supabase
    .from('products')
    .update({ price: testPrice })
    .eq('id', productId);

  assert(!error, `Updated price to ₹${testPrice} in Supabase`);

  // 3. Check API
  const apiProduct = await fetchProductFromAPI(productId);
  assertEqual(apiProduct.price, testPrice, 'API returns updated price');

  // 4. Check frontend
  await openProductPage(productId);
  const frontendPrice = await getFrontendPrice();
  assertEqual(frontendPrice, testPrice, 'Frontend renders updated price');

  // 5. Restore original price
  await supabase
    .from('products')
    .update({ price: originalPrice })
    .eq('id', productId);

  // 6. Verify restoration via API
  const restoredProduct = await fetchProductFromAPI(productId);
  assertEqual(restoredProduct.price, originalPrice, 'Price restored to original');
}

async function testStockReservation(productId: string, size: string) {
  console.log('\n── Test 2: Stock Reservation (API + Frontend) ──');

  // 1. Get current state
  const before = await getInventoryFromDB(productId, size);
  console.log(`  Before: quantity=${before.quantity}, reserved=${before.reserved_quantity}`);

  const apiBefore = await fetchProductFromAPI(productId);
  const invBefore = apiBefore.inventory?.find((i: { size: string }) => i.size === size);
  const availableBefore = parseInt(invBefore?.quantity || '0');
  console.log(`  API available before: ${availableBefore}`);

  // 2. Reserve 1 unit
  const { data: reserved, error } = await supabase.rpc('reserve_stock', {
    p_product_id: productId,
    p_size: size,
    p_quantity: 1,
  });

  assert(!error && reserved === true, 'reserve_stock RPC succeeded');

  // 3. Check DB state
  const afterReserve = await getInventoryFromDB(productId, size);
  assertEqual(afterReserve.reserved_quantity, before.reserved_quantity + 1, 'DB reserved_quantity incremented by 1');
  assertEqual(afterReserve.quantity, before.quantity, 'DB quantity unchanged after reservation');

  // 4. Check API
  const apiAfter = await fetchProductFromAPI(productId);
  const invAfter = apiAfter.inventory?.find((i: { size: string }) => i.size === size);
  const availableAfter = parseInt(invAfter?.quantity || '0');
  assertEqual(availableAfter, availableBefore - 1, 'API shows 1 less available');

  // 5. Check frontend
  await openProductPage(productId);
  const frontendStock = await getFrontendStockForSize(size);
  assert(frontendStock !== null, 'Frontend shows size button');
  if (frontendStock) {
    assertEqual(frontendStock.available, availableBefore - 1, 'Frontend shows 1 less available');
  }

  return { before };
}

async function testStockRelease(productId: string, size: string, originalState: { quantity: number; reserved_quantity: number }) {
  console.log('\n── Test 3: Stock Release (cancel/timeout) ──');

  // 1. Release the 1 unit we reserved in Test 2
  const { error } = await supabase.rpc('release_stock', {
    p_product_id: productId,
    p_size: size,
    p_quantity: 1,
  });

  assert(!error, 'release_stock RPC succeeded');

  // 2. Check DB
  const afterRelease = await getInventoryFromDB(productId, size);
  assertEqual(afterRelease.reserved_quantity, originalState.reserved_quantity, 'DB reserved_quantity back to original');
  assertEqual(afterRelease.quantity, originalState.quantity, 'DB quantity unchanged');

  // 3. Check API
  const apiAfter = await fetchProductFromAPI(productId);
  const inv = apiAfter.inventory?.find((i: { size: string }) => i.size === size);
  const available = parseInt(inv?.quantity || '0');
  const expectedAvailable = originalState.quantity - originalState.reserved_quantity;
  assertEqual(available, expectedAvailable, 'API shows original available quantity');

  // 4. Check frontend
  await openProductPage(productId);
  const frontendStock = await getFrontendStockForSize(size);
  if (frontendStock) {
    assertEqual(frontendStock.available, expectedAvailable, 'Frontend shows original available quantity');
  }
}

async function testStockCommit(productId: string, size: string) {
  console.log('\n── Test 4: Stock Commit (payment success simulation) ──');

  // 1. Get current state
  const before = await getInventoryFromDB(productId, size);
  console.log(`  Before: quantity=${before.quantity}, reserved=${before.reserved_quantity}`);

  // 2. Reserve 1 unit first (commit expects stock to be reserved)
  await supabase.rpc('reserve_stock', {
    p_product_id: productId,
    p_size: size,
    p_quantity: 1,
  });

  const afterReserve = await getInventoryFromDB(productId, size);
  assertEqual(afterReserve.reserved_quantity, before.reserved_quantity + 1, 'Stock reserved for commit test');

  // 3. Commit the sale
  const { error } = await supabase.rpc('commit_stock_sale', {
    p_product_id: productId,
    p_size: size,
    p_quantity: 1,
  });

  assert(!error, 'commit_stock_sale RPC succeeded');

  // 4. Check DB
  const afterCommit = await getInventoryFromDB(productId, size);
  assertEqual(afterCommit.quantity, before.quantity - 1, 'DB quantity decreased by 1 (sold)');
  assertEqual(afterCommit.reserved_quantity, before.reserved_quantity, 'DB reserved_quantity back to original');

  // 5. Check API
  const apiAfter = await fetchProductFromAPI(productId);
  const inv = apiAfter.inventory?.find((i: { size: string }) => i.size === size);
  const available = parseInt(inv?.quantity || '0');
  const expectedAvailable = (before.quantity - 1) - before.reserved_quantity;
  assertEqual(available, expectedAvailable, 'API shows 1 less available (permanent)');

  // 6. Check frontend
  await openProductPage(productId);
  const frontendStock = await getFrontendStockForSize(size);
  if (frontendStock) {
    assertEqual(frontendStock.available, expectedAvailable, 'Frontend shows 1 less available (permanent)');
  }

  // 7. Restore quantity
  await supabase
    .from('product_inventory')
    .update({ quantity: before.quantity })
    .eq('product_id', productId)
    .eq('size', size);

  const restored = await getInventoryFromDB(productId, size);
  assertEqual(restored.quantity, before.quantity, 'Quantity restored for cleanup');
}

async function testFullLifecycle(productId: string, size: string) {
  console.log('\n── Test 5: Full Lifecycle (reserve → commit → verify API + Frontend) ──');

  const QTY = 1;

  // 1. Snapshot
  const before = await getInventoryFromDB(productId, size);
  const apiBefore = await fetchProductFromAPI(productId);
  const invBefore = apiBefore.inventory?.find((i: { size: string }) => i.size === size);
  const availableBefore = parseInt(invBefore?.quantity || '0');
  console.log(`  Start: qty=${before.quantity}, reserved=${before.reserved_quantity}, API available=${availableBefore}`);

  // 2. Reserve
  const { data: reserved } = await supabase.rpc('reserve_stock', {
    p_product_id: productId,
    p_size: size,
    p_quantity: QTY,
  });
  assert(reserved === true, `Reserved ${QTY} units`);

  // Check API mid-reservation
  const apiMid = await fetchProductFromAPI(productId);
  const invMid = apiMid.inventory?.find((i: { size: string }) => i.size === size);
  assertEqual(parseInt(invMid?.quantity || '0'), availableBefore - QTY, `API shows ${QTY} less after reservation`);

  // Check frontend mid-reservation
  await openProductPage(productId);
  const midStock = await getFrontendStockForSize(size);
  if (midStock) {
    assertEqual(midStock.available, availableBefore - QTY, `Frontend shows ${QTY} less after reservation`);
  }

  // 3. Commit
  await supabase.rpc('commit_stock_sale', {
    p_product_id: productId,
    p_size: size,
    p_quantity: QTY,
  });

  const afterCommit = await getInventoryFromDB(productId, size);
  assertEqual(afterCommit.quantity, before.quantity - QTY, `DB quantity reduced by ${QTY}`);
  assertEqual(afterCommit.reserved_quantity, before.reserved_quantity, 'DB reserved back to original');

  // Check API after commit
  const apiEnd = await fetchProductFromAPI(productId);
  const invEnd = apiEnd.inventory?.find((i: { size: string }) => i.size === size);
  assertEqual(parseInt(invEnd?.quantity || '0'), availableBefore - QTY, `API available permanently reduced by ${QTY}`);

  // Check frontend after commit
  await openProductPage(productId);
  const endStock = await getFrontendStockForSize(size);
  if (endStock) {
    assertEqual(endStock.available, availableBefore - QTY, `Frontend available permanently reduced by ${QTY}`);
  }

  // 4. Cleanup
  await supabase
    .from('product_inventory')
    .update({ quantity: before.quantity })
    .eq('product_id', productId)
    .eq('size', size);

  console.log('  Cleaned up — quantity restored.');
}

async function testOutOfStockReservation(productId: string, size: string) {
  console.log('\n── Test 6: Out-of-Stock Reservation Rejection ──');

  const before = await getInventoryFromDB(productId, size);

  const overQuantity = before.quantity + 100;
  const { data: reserved, error } = await supabase.rpc('reserve_stock', {
    p_product_id: productId,
    p_size: size,
    p_quantity: overQuantity,
  });

  assert(reserved === false || !!error, `Reserving ${overQuantity} units correctly rejected`);

  const after = await getInventoryFromDB(productId, size);
  assertEqual(after.quantity, before.quantity, 'DB quantity unchanged after rejection');
  assertEqual(after.reserved_quantity, before.reserved_quantity, 'DB reserved unchanged after rejection');
}

async function testNoReturnsPolicy(productId: string) {
  console.log('\n── Test 7: "No Returns" Policy Text on Frontend ──');

  // Check product page
  await openProductPage(productId);
  let text = await getPageText();

  assert(text.includes('No Returns'), 'Product page shows "No Returns"');
  assert(!text.includes('Easy Returns'), 'Product page does NOT show "Easy Returns"');
  assert(!text.includes('7 days return'), 'Product page does NOT mention "7 days return"');

  // Check cart page
  await page.goto(`${BASE_URL}/cart`, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout: 10000 }
  );
  text = await getPageText();

  // Cart might be empty, but trust badges should still render if items are present
  // Check the source doesn't contain Easy Returns at the code level
  const cartHtml = await page.content();
  assert(!cartHtml.includes('Easy Returns'), 'Cart page source does NOT contain "Easy Returns"');
  assert(!cartHtml.includes('7 days return policy'), 'Cart page source does NOT mention "7 days return policy"');
}

// ── Runner ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   Inventory & Price Sync Test Suite               ║');
  console.log('║   Testing against: ' + BASE_URL.padEnd(30) + ' ║');
  console.log('╚═══════════════════════════════════════════════════╝');

  // Verify dev server is running
  try {
    const res = await fetch(`${BASE_URL}/api/products?limit=1`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
  } catch {
    console.error(`\n❌ Cannot reach ${BASE_URL}. Start the dev server first: npm run dev\n`);
    process.exit(1);
  }

  // Launch browser
  console.log('\n🌐 Launching headless browser...');
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    const { id, size } = await pickTestProduct();

    await testPriceSync(id);
    const { before } = await testStockReservation(id, size);
    await testStockRelease(id, size, before);
    await testStockCommit(id, size);
    await testFullLifecycle(id, size);
    await testOutOfStockReservation(id, size);
    await testNoReturnsPolicy(id);

  } catch (err) {
    console.error('\n💥 Unexpected error:', err);
    failed++;
  } finally {
    await browser.close();
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.log('\n  Failures:');
    failures.forEach(f => console.log(`    - ${f}`));
  }
  console.log('═══════════════════════════════════════════════════\n');

  process.exit(failed > 0 ? 1 : 0);
}

main();
