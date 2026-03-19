import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const backendBase = 'https://womb-care-backend-76858014616.us-central1.run.app/api';
  
  let blogEntries: MetadataRoute.Sitemap = [];
  
  try {
    const res = await fetch(`${backendBase}/blogs`, { next: { revalidate: 3600 } });
    const { data: blogs } = await res.json();
    
    blogEntries = blogs.map((blog: any) => ({
      url: `https://wombcare.in/blogs/${blog.slug || blog.id}`,
      lastModified: new Date(blog.updatedAt || blog.createdAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  return [
    {
      url: 'https://wombcare.in',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://wombcare.in/blogs',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://wombcare.in/careers',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...blogEntries,
  ];
}