import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/wombcare-admin-9984/', '/api/'],
    },
    sitemap: 'https://wombcare.in/sitemap.xml',
  };
}