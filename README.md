# Prakash Duo Store

Full-stack e-commerce platform for traditional Indian bangles. Built with Next.js 14 (App Router), TypeScript, Supabase, and Tailwind CSS.

## Features

**Customer-facing store:**
- Product catalog with category filtering and search
- Product detail pages with image galleries and reviews
- Shopping cart with persistent state (Context API)
- Wishlist functionality
- Checkout flow with Cashfree payment gateway integration
- Order tracking and confirmation with email notifications
- Responsive, mobile-first design

**Admin dashboard:**
- Product and category CRUD management
- Order management and status tracking
- Inventory management
- Email management
- Sales statistics and analytics

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | Radix UI |
| **Animation** | Framer Motion |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Payments** | Cashfree Payment Gateway |
| **Email** | Nodemailer + Zoho SMTP |
| **Validation** | Zod |

## Project Structure

```
src/
├── app/
│   ├── (store)/          # Customer-facing routes
│   │   ├── cart/         # Shopping cart
│   │   ├── checkout/     # Checkout flow
│   │   ├── product/[id]/ # Product details
│   │   ├── category/     # Category pages
│   │   ├── wishlist/     # Wishlist
│   │   └── track-order/  # Order tracking
│   ├── admin/            # Admin dashboard
│   │   ├── products/     # Product management
│   │   ├── orders/       # Order management
│   │   ├── inventory/    # Inventory management
│   │   └── categories/   # Category management
│   └── api/              # API routes
│       ├── admin/        # Admin CRUD endpoints
│       ├── payments/     # Cashfree webhook & verification
│       └── orders/       # Order creation
├── components/           # React components
├── lib/                  # Utilities, Supabase clients, email
├── context/              # Cart state (Context + useReducer)
└── data/                 # Static product/category JSON
```

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project
- Cashfree account (for payments)

### Setup

```bash
git clone https://github.com/30Nomad032000/prakash-duo-store.git
cd prakash-duo-store
npm install
cp .env.example .env.local
# Fill in your Supabase and Cashfree credentials in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the store.

## Build

```bash
npm run build   # Generates static data + Next.js build
npm start       # Production server
```
