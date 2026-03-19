import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Blog } from '@/types/blog';
import FloatingNavbar from '@/components/FloatingNavbar';
import BlogContent from '@/components/BlogContent';
import { Calendar, ArrowLeft, Clock, Share2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Props {
  params: Promise<{ slug: string }>;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getBlog(slug: string): Promise<Blog | null> {
  const backendBase = 'https://womb-care-backend-76858014616.us-central1.run.app/api';
  
  try {
    // 1. Try fetching by slug directly (in case backend is updated)
    const slugRes = await fetch(`${backendBase}/blogs/slug/${slug}`, {
      next: { revalidate: 3600 },
    });
    
    if (slugRes.ok) {
      const json = await slugRes.json();
      return json.data;
    }

    // 2. Fallback: Search in the list
    const listRes = await fetch(`${backendBase}/blogs`, {
      next: { revalidate: 300 }, // Cache list for 5 mins
    });

    if (!listRes.ok) return null;
    const listJson = await listRes.json();
    const blogs: Blog[] = listJson.data || [];

    // Find a blog that matches the slug
    const matchedBlog = blogs.find(b => generateSlug(b.title) === slug || b.id === slug);
    
    if (!matchedBlog) return null;

    // 3. Fetch the full detail by ID to get the full content
    const detailRes = await fetch(`${backendBase}/blogs/${matchedBlog.id}`, {
      next: { revalidate: 3600 },
    });

    if (!detailRes.ok) return matchedBlog; // Use list data as fallback
    const detailJson = await detailRes.json();
    return detailJson.data;

  } catch (error) {
    console.error('Fetch blog error:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  
  if (!blog) return { title: 'Blog Not Found | WombCare' };
  
  const description = blog.excerpt || blog.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...';
  
  return {
    title: `${blog.title} | WombCare`,
    description,
    openGraph: {
      title: blog.title,
      description,
      type: 'article',
      url: `https://wombcare.in/blogs/${slug}`,
      images: (blog.coverImage || blog.cover_image) ? [{ url: (blog.coverImage || blog.cover_image)! }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      images: (blog.coverImage || blog.cover_image) ? [(blog.coverImage || blog.cover_image)!] : [],
    }
  };
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      '@type': 'Organization',
      name: 'WombCare',
    },
    image: blog.coverImage || blog.cover_image,
    description: blog.excerpt || blog.title,
  };

  const bannerImage = blog.coverImage || blog.cover_image;

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      <FloatingNavbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="pt-32 pb-16 bg-[#FDFCFD] border-b border-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <Link 
            href="/blogs"
            className="flex items-center gap-2 text-slate-400 hover:text-pink-600 transition-colors mb-10 group text-sm font-semibold inline-flex"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>
          <div className="flex items-center gap-4 mb-6 text-xs font-bold text-pink-500 uppercase tracking-[0.2em]">
            <span className="bg-pink-50 px-3 py-1 rounded-full border border-pink-100 italic font-medium">Self-Care & Wellness</span>
            <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {Math.ceil(blog.content.length / 1000)} min read
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] mb-12 tracking-tight">
            {blog.title}
          </h1>
          <div className="flex items-center justify-between py-8 border-y border-slate-100">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {blog.authorName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{blog.authorName}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 uppercase tracking-wider font-semibold">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
                  </div>
                </div>
             </div>
             <button className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-all font-semibold text-sm">
               <Share2 className="w-4 h-4" />
               Share
             </button>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-6 py-20 w-full">
        {bannerImage && (
          <div className="mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-slate-200">
            <img src={bannerImage} alt={blog.title} className="w-full h-auto max-h-[600px] object-cover" />
          </div>
        )}
        
        <BlogContent content={blog.content} />

        <div className="mt-24 p-12 rounded-[3.5rem] bg-slate-900 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Want more wellness?</h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">Join our community for weekly expert insights delivered straight to your inbox.</p>
            <div className="max-w-md mx-auto flex gap-3 flex-col sm:flex-row">
              <input type="email" placeholder="nina@example.com" className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/10 outline-none focus:bg-white/10 focus:border-pink-500 transition-all text-white" />
              <button className="px-8 py-4 bg-pink-500 hover:bg-pink-600 rounded-full font-bold shadow-lg transition-all active:scale-[0.98]">Subscribe</button>
            </div>
          </div>
        </div>
      </article>

      <footer className="mt-auto bg-slate-50 text-slate-400 py-12 text-center text-xs border-t border-slate-100">
        <p>&copy; {new Date().getFullYear()} WombCare Wellness. All rights reserved.</p>
      </footer>
    </main>
  );
}
