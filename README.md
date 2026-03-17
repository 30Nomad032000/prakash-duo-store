# Bangles by Prakash Duo

Full-stack e-commerce platform for handcrafted traditional Indian bangles from Thrissur, Kerala. Built with Next.js 14 (App Router), TypeScript, Supabase, Razorpay, and Tailwind CSS.

**Live:** [banglesbyprakashduo.store](https://www.banglesbyprakashduo.store)

## Features

**Customer-facing store:**
- Cinematic landing page with GSAP scroll animations
- Product catalog with category filtering and search
- Product detail pages with image galleries, size selection, and live inventory
- Shopping cart with persistent state, quantity caps, and shipping calculation
- Wishlist functionality
- Checkout flow with Razorpay payment gateway (UPI, cards, net banking, wallets)
- Razorpay webhook for reliable payment capture and failure handling
- Order tracking and confirmation with branded email notifications
- Free shipping above ₹599, ₹99 for orders below
- Web haptics (vibration feedback) on mobile for key interactions
- Responsive, mobile-first design with heritage aesthetic
- Full SEO: sitemap, robots.txt, JSON-LD, Open Graph, Google Search Console

**Admin dashboard:**
- Order management with full lifecycle (confirm → process → ship → deliver → cancel)
- Order cancellation with reason and customer email notification
- Shipping tracking with DTDC integration and email notifications
- Inventory management with category-grouped accordion and stock editing
- Product and category CRUD management
- Email logs with resend capability
- Invoice printing system
- Sales statistics

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui (Radix UI) |
| **Animation** | Framer Motion, GSAP |
| **Haptics** | web-haptics |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Payments** | Razorpay |
| **Email** | Resend |
| **Validation** | Zod |
| **Hosting** | Vercel |
| **Loading** | ldrs (Trefoil loader) |

## Project Structure

```
src/
├── app/
│   ├── (landing)/          # Cinematic landing page
│   ├── (store)/            # Customer-facing routes
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout flow (Razorpay)
│   │   ├── product/[id]/   # Product details
│   │   ├── category/       # Category pages
│   │   ├── categories/     # All collections
│   │   ├── wishlist/       # Wishlist
│   │   ├── track-order/    # Order tracking
│   │   ├── order-confirmation/ # Post-payment confirmation
│   │   ├── shipping/       # Shipping policy
│   │   ├── refund/         # Refund policy
│   │   ├── privacy/        # Privacy policy
│   │   ├── terms/          # Terms & conditions
│   │   ├── faq/            # FAQs
│   │   ├── about/          # Our story
│   │   └── contact/        # Contact page
│   ├── admin/              # Admin dashboard
│   │   ├── orders/         # Order management + cancellation
│   │   ├── products/       # Product management
│   │   ├── inventory/      # Inventory management
│   │   ├── categories/     # Category management
│   │   └── emails/         # Email logs
│   └── api/
│       ├── admin/          # Admin CRUD + cancel endpoint
│       ├── payments/       # Razorpay webhook & verification
│       └── orders/         # Order creation with stock reservation
├── components/             # React components
│   ├── cart/               # CartDrawer, CartItem, CartSummary
│   ├── checkout/           # CheckoutForm, ShippingForm
│   ├── seo/                # PageSeo, JsonLd
│   └── ui/                 # shadcn/ui + Loader
├── lib/
│   ├── email/              # Resend integration + 5 branded templates
│   ├── supabase/           # DB types
│   ├── razorpay.ts         # Razorpay orders, verification, shipping calc
│   ├── supabase-orders.ts  # Order CRUD, stock reserve/release/commit
│   └── products.ts         # Product data utilities
├── context/                # Cart + Wishlist (Context + useReducer)
├── hooks/                  # useHaptics
└── data/                   # Static product/category JSON
```

## Order Flow

```
Customer places order
  → Stock reserved (Supabase inventory check)
  → Razorpay order created
  → Customer pays via Razorpay modal
  → Webhook: payment.captured → stock committed, emails sent
  → Webhook: payment.failed → stock released, order cancelled

Admin lifecycle:
  pending → confirmed → processing → shipped → delivered
     ↓          ↓           ↓
  cancelled (with reason + customer email + stock release)
```

## Email Templates

Five branded HTML email templates matching the store's heritage aesthetic:
- **Order Confirmation** — sent to customer on payment capture
- **Shipping Notification** — sent when tracking is added
- **Delivery Confirmation** — sent when marked delivered
- **Cancellation** — sent with reason when admin cancels
- **New Order Notification** — sent to store owner (Prakashduo19@gmail.com)

Preview all templates: `npx tsx scripts/send-template-previews.ts <email>`

## Environment Variables

```bash
# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Email (Resend)
RESEND_API_KEY=re_xxxxx
EMAIL_FROM_NAME=Bangles by Prakash Duo
EMAIL_FROM_ADDRESS=orders@banglesbyprakashduo.store

# Store Owner Notification
STORE_OWNER_EMAIL=Prakashduo19@gmail.com

# App
NEXT_PUBLIC_BASE_URL=https://www.banglesbyprakashduo.store
```

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project
- Razorpay account (live or test)
- Resend account with verified domain

### Setup

```bash
git clone https://github.com/30Nomad032000/prakash-duo-store.git
cd prakash-duo-store
npm install
cp .env.example .env
# Fill in your credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the store.

### Razorpay Webhook

Create a webhook in Razorpay Dashboard → Account & Settings → Webhooks:
- **URL:** `https://www.banglesbyprakashduo.store/api/payments/webhook`
- **Events:** `payment.captured`, `payment.failed`
- **Secret:** same value as `RAZORPAY_WEBHOOK_SECRET`

## Build

```bash
npm run build
npm start
```
