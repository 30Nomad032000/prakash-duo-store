import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/*', '/api/*', '/checkout', '/order-confirmation'],
      },
    ],
    sitemap: 'https://banglesbyprakashduo.store/sitemap.xml',
  }
}
