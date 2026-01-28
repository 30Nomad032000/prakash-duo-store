# Security Audit Report - Prakash Duo Store

**Audit Date:** January 26, 2025
**Status:** Pending Fixes
**Total Issues:** 18

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 6 | ❌ Unfixed |
| High | 5 | ❌ Unfixed |
| Medium | 5 | ❌ Unfixed |
| Low | 2 | ❌ Unfixed |

---

## Critical Issues

### 1. Admin API Routes Have No Authentication
**Files Affected:**
- `src/app/api/admin/orders/route.ts`
- `src/app/api/admin/orders/[id]/route.ts`
- `src/app/api/admin/orders/[id]/tracking/route.ts`
- `src/app/api/admin/orders/[id]/delivered/route.ts`
- `src/app/api/admin/products/route.ts`
- `src/app/api/admin/products/[id]/route.ts`
- `src/app/api/admin/categories/route.ts`
- `src/app/api/admin/categories/[id]/route.ts`
- `src/app/api/admin/inventory/route.ts`
- `src/app/api/admin/inventory/[productId]/route.ts`
- `src/app/api/admin/inventory/export/route.ts`
- `src/app/api/admin/emails/route.ts`
- `src/app/api/admin/emails/[id]/resend/route.ts`
- `src/app/api/admin/stats/route.ts`

**Issue:** None of the admin API routes verify authentication. They use the service role key which bypasses RLS.

**Attack Vector:**
```bash
# Anyone can access all orders
curl "https://yoursite.com/api/admin/orders"

# Anyone can delete products
curl -X DELETE "https://yoursite.com/api/admin/products/product_id"

# Anyone can export inventory
curl "https://yoursite.com/api/admin/inventory/export"
```

**Fix Required:**
```typescript
// Add to every admin route handler
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  // 1. Verify authentication
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Verify admin role (see issue #2)
  // ... rest of handler
}
```

**Status:** ❌ Unfixed

---

### 2. No Role/Permission Verification
**File:** `src/middleware.ts` (Line 45)

**Issue:** Middleware only checks if user is authenticated, not if they're an admin. Any Supabase user can access admin routes.

**Current Code:**
```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user && !isLoginPage) {
  // Only checks if logged in, not if admin
}
```

**Fix Required:**
1. Create `admin_users` table in Supabase
2. Check user role in middleware and API routes:
```typescript
const { data: adminUser } = await supabase
  .from('admin_users')
  .select('role')
  .eq('user_id', user.id)
  .single();

if (!adminUser || adminUser.role !== 'admin') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

**Status:** ❌ Unfixed

---

### 3. Webhook Signature Verification Bypassed
**File:** `src/app/api/payments/webhook/route.ts` (Lines 37-47)

**Issue:** Webhook verification is skipped if `CASHFREE_SECRET_KEY` is not set.

**Current Code:**
```typescript
if (process.env.CASHFREE_SECRET_KEY) {
  const isValid = verifyWebhookSignature(payload, timestamp, signature);
  // Verification only happens if key exists
}
```

**Risk:** Attackers can forge webhook notifications to mark orders as paid without actual payment.

**Fix Required:**
```typescript
// Always verify - fail if key missing
if (!process.env.CASHFREE_SECRET_KEY) {
  console.error('CASHFREE_SECRET_KEY not configured');
  return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
}

const isValid = verifyWebhookSignature(payload, timestamp, signature);
if (!isValid) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}
```

**Status:** ❌ Unfixed

---

### 4. Payment Auto-Confirmed in Development Mode
**File:** `src/app/api/payments/verify/route.ts` (Lines 77-89)

**Issue:** Orders auto-confirm as paid in development mode.

**Current Code:**
```typescript
if (process.env.NODE_ENV === 'development' && !process.env.CASHFREE_APP_ID) {
  paymentStatus = 'paid';
  await updatePaymentStatus(orderId, 'paid');
}
```

**Risk:** Could accidentally be deployed to production if env vars misconfigured.

**Fix Required:** Remove auto-confirmation or use explicit test mode flag:
```typescript
if (process.env.PAYMENT_TEST_MODE === 'true') {
  // Only if explicitly enabled
}
```

**Status:** ❌ Unfixed

---

### 5. Order Prices Not Validated Server-Side
**File:** `src/app/api/orders/route.ts` (Lines 23-26)

**Issue:** Client sends prices; server doesn't verify against database.

**Current Code:**
```typescript
const { customer, shippingAddress, items } = result.data;
const { subtotal, shipping, tax, total } = calculateOrderTotals(items);
// Uses client-provided prices!
```

**Attack Vector:**
```javascript
// Attacker modifies request
{ items: [{ productId: "xyz", price: 1, quantity: 10 }] }
// Gets ₹5000 product for ₹1
```

**Fix Required:**
```typescript
// Fetch actual prices from database
const productIds = items.map(i => i.productId);
const { data: products } = await supabase
  .from('products')
  .select('id, price')
  .in('id', productIds);

// Validate each item price matches database
for (const item of items) {
  const dbProduct = products.find(p => p.id === item.productId);
  if (!dbProduct || dbProduct.price !== item.price) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
  }
}
```

**Status:** ❌ Unfixed

---

### 6. Payment Amount Not Verified in Webhook
**File:** `src/app/api/payments/webhook/route.ts` (Lines 56-70)

**Issue:** Webhook doesn't verify that payment amount matches order total.

**Attack Vector:** Attacker sends webhook with `payment_amount: 1` for ₹5000 order.

**Fix Required:**
```typescript
const order = await getOrderByOrderId(orderId);
if (payment.payment_amount !== order.total) {
  console.error('Payment amount mismatch', { expected: order.total, received: payment.payment_amount });
  return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
}
```

**Status:** ❌ Unfixed

---

## High Severity Issues

### 7. Order Lookup Unprotected
**File:** `src/app/api/orders/route.ts` (Lines 97-132)

**Issue:** Anyone can retrieve any order by guessing order ID.

**Current Code:**
```typescript
export async function GET(request: NextRequest) {
  const orderId = searchParams.get('order_id');
  const order = await getOrderByOrderId(orderId);
  // Returns full order with PII
}
```

**Data Exposed:**
- Customer name, email, phone
- Full shipping address
- Order items and prices
- Payment status

**Fix Required:** Require email verification:
```typescript
const orderId = searchParams.get('order_id');
const email = searchParams.get('email');

const order = await getOrderByOrderId(orderId);
if (order.customer.email !== email) {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
```

**Status:** ❌ Unfixed

---

### 8. No Input Validation on Admin Operations
**Files Affected:**
- `src/app/api/admin/products/route.ts` (POST)
- `src/app/api/admin/products/[id]/route.ts` (PUT, PATCH)
- `src/app/api/admin/categories/route.ts` (POST)
- `src/app/api/admin/inventory/[productId]/route.ts` (PATCH)

**Issue:** No validation of:
- Price (can be negative, zero, extremely large)
- String lengths (potential XSS)
- Array contents
- Enum values (status fields)

**Fix Required:** Add Zod schemas:
```typescript
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().positive().max(1000000),
  category: z.string().min(1).max(100),
  sizes: z.array(z.string()).min(1),
  images: z.array(z.string().url()).min(1),
});

// In route handler
const result = productSchema.safeParse(body);
if (!result.success) {
  return NextResponse.json({ error: result.error }, { status: 400 });
}
```

**Status:** ❌ Unfixed

---

### 9. Sensitive Data in API Responses
**Files Affected:**
- `src/app/api/admin/orders/route.ts` (Line 89)
- `src/app/api/admin/orders/[id]/route.ts`

**Issue:** Payment session IDs exposed in responses.

**Current Code:**
```typescript
paymentSessionId: order.payment_session_id, // Sensitive!
```

**Fix Required:** Remove sensitive fields from responses:
```typescript
const { payment_session_id, ...safeOrder } = order;
return NextResponse.json({ order: safeOrder });
```

**Status:** ❌ Unfixed

---

### 10. SQL Injection Risk in Query Building
**File:** `src/app/api/admin/products/[id]/route.ts` (Line 123)

**Issue:** User input concatenated into query string.

**Current Code:**
```typescript
.not('size', 'in', `(${currentSizes.map((s: string) => `'${s}'`).join(',')})`)
```

**Fix Required:** Use parameterized queries or Supabase's array syntax.

**Status:** ❌ Unfixed

---

### 11. Inventory Export Completely Unprotected
**File:** `src/app/api/admin/inventory/export/route.ts`

**Issue:** No authentication, no rate limiting. Exports all inventory data.

**Attack Vector:**
```bash
curl "https://yoursite.com/api/admin/inventory/export" > inventory.csv
```

**Status:** ❌ Unfixed

---

## Medium Severity Issues

### 12. No Rate Limiting
**Files Affected:** All API routes

**Issue:** No protection against:
- Brute force attacks on login
- Order ID enumeration
- API abuse/scraping
- DoS attacks

**Fix Required:** Implement rate limiting with Upstash Redis or similar:
```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

// In route handler
const { success } = await ratelimit.limit(ip);
if (!success) {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
}
```

**Status:** ❌ Unfixed

---

### 13. No CSRF Protection
**Files Affected:** All state-changing API routes

**Issue:** No CSRF token validation on POST/PUT/PATCH/DELETE requests.

**Fix Required:** Implement CSRF tokens for admin operations.

**Status:** ❌ Unfixed

---

### 14. No Audit Logging
**Files Affected:** All admin routes

**Issue:** No record of:
- Who performed admin operations
- When changes were made
- What was modified

**Fix Required:** Create audit log table and log all admin operations:
```typescript
await supabase.from('audit_logs').insert({
  user_id: user.id,
  action: 'UPDATE_ORDER_STATUS',
  resource_type: 'order',
  resource_id: orderId,
  changes: { old: previousStatus, new: newStatus },
  ip_address: request.headers.get('x-forwarded-for'),
  timestamp: new Date().toISOString(),
});
```

**Status:** ❌ Unfixed

---

### 15. Error Messages Reveal System Details
**Files Affected:** All API routes

**Issue:** Database errors returned directly to client.

**Current Code:**
```typescript
if (error) {
  return NextResponse.json({ error: error.message }, { status: 500 });
}
```

**Fix Required:**
```typescript
if (error) {
  console.error('Database error:', error); // Log full error
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

**Status:** ❌ Unfixed

---

### 16. Stock Double-Deduction Risk
**Files:**
- `src/app/api/payments/webhook/route.ts`
- `src/app/api/payments/verify/route.ts`

**Issue:** Both routes call `commitStockSale()`. If both fire, stock is deducted twice.

**Fix Required:** Use idempotency keys or check if already committed:
```typescript
if (order.payment_status === 'paid') {
  // Already processed, skip
  return NextResponse.json({ success: true });
}
```

**Status:** ❌ Unfixed

---

## Low Severity Issues

### 17. Open Redirect Vulnerability
**File:** `src/app/admin/login/page.tsx` (Line 14, 33)

**Issue:** Redirect parameter not validated.

**Current Code:**
```typescript
const redirect = searchParams.get('redirect') || '/admin';
router.push(redirect);
```

**Attack Vector:**
```
/admin/login?redirect=https://evil.com
```

**Fix Required:**
```typescript
const redirect = searchParams.get('redirect') || '/admin';
const safeRedirect = redirect.startsWith('/admin') ? redirect : '/admin';
router.push(safeRedirect);
```

**Status:** ❌ Unfixed

---

### 18. No Login Rate Limiting
**File:** `src/app/admin/login/page.tsx`

**Issue:** No protection against brute force password attacks.

**Fix Required:** Implement account lockout after N failed attempts.

**Status:** ❌ Unfixed

---

## Implementation Checklist

### Phase 1: Critical Fixes (Do First)
- [ ] Add authentication to all admin API routes
- [ ] Implement role-based access control
- [ ] Fix webhook signature verification
- [ ] Remove dev mode payment auto-confirmation
- [ ] Validate order prices server-side
- [ ] Verify payment amounts in webhook

### Phase 2: High Priority
- [ ] Protect order lookup with email verification
- [ ] Add Zod input validation schemas
- [ ] Remove sensitive data from API responses
- [ ] Fix SQL query building
- [ ] Protect inventory export

### Phase 3: Medium Priority
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Create audit logging system
- [ ] Sanitize error messages
- [ ] Fix stock double-deduction

### Phase 4: Low Priority
- [ ] Fix open redirect
- [ ] Add login rate limiting

---

## Secure Admin Route Template

Use this pattern for all admin API routes:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

// 1. Define input schema
const inputSchema = z.object({
  // ... your schema
});

export async function POST(request: NextRequest) {
  try {
    // 2. Authenticate
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Authorize (check admin role)
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 4. Validate input
    const body = await request.json();
    const result = inputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // 5. Process request
    // ... your logic

    // 6. Audit log
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'ACTION_NAME',
      // ...
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## Database Schema Required

```sql
-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
```

---

## Notes

- Regenerate Supabase keys if they were ever committed to git
- Review Supabase RLS policies for all tables
- Consider implementing Content Security Policy headers
- Set up monitoring/alerting for suspicious activity
