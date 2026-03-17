const BASE_URL = 'https://banglesbyprakashduo.store'

// --- Organization JSON-LD ---

export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bangles by Prakash Duo',
    url: BASE_URL,
    logo: `${BASE_URL}/assets/logo/Logo.png`,
    description: 'Handcrafted bangles from Thrissur, Kerala',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Thrissur',
      addressRegion: 'Kerala',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-79092-02091',
      email: 'support@banglesbyprakashduo.store',
      contactType: 'customer service',
    },
    sameAs: ['https://www.instagram.com/bangles_byprakashduo'],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// --- WebSite JSON-LD (with SearchAction) ---

export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bangles by Prakash Duo',
    url: BASE_URL,
    description:
      'Handcrafted bangles from the heart of Thrissur, Kerala — born from tradition, worn for a lifetime.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/categories?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// --- Product JSON-LD ---

interface ProductJsonLdProps {
  name: string
  description: string
  price: number
  images: string[]
  category: string
  availability: 'InStock' | 'OutOfStock' | 'PreOrder'
  url: string
}

export function ProductJsonLd({
  name,
  description,
  price,
  images,
  category,
  availability,
  url,
}: ProductJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: images.map((img) =>
      img.startsWith('http') ? img : `${BASE_URL}${img}`
    ),
    category,
    url,
    brand: {
      '@type': 'Brand',
      name: 'Prakash Duo',
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'INR',
      price: price.toFixed(2),
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: 'Bangles by Prakash Duo',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// --- Breadcrumb JSON-LD ---

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
