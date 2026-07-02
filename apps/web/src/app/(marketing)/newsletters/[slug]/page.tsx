import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AnimatedHeading, FadeIn } from '../../../../components/motion/MotionPrimitives';

export const revalidate = 60;

interface NewsletterDetail {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  excerpt?: string | null;
  pdf?: { url: string } | null;
}

interface NewsletterDetailResponse {
  data: NewsletterDetail;
}

async function getNewsletterBySlug(slug: string): Promise<NewsletterDetail | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  try {
    const res = await fetch(`${API_URL}/newsletters/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = (await res.json()) as unknown;
    return (json as NewsletterDetailResponse).data;
  } catch (error) {
    return null;
  }
}

export default async function NewsletterIssuePage({ params }: { params: Promise<{ slug: string }> }): Promise<React.ReactElement> {
  const resolvedParams = await params;
  const issue = await getNewsletterBySlug(resolvedParams.slug);

  if (!issue) {
    notFound();
  }

  return (
    <main className="min-h-screen py-24 px-6 max-w-4xl mx-auto">
      <Link href="/newsletters" className="text-blue-600 hover:underline mb-8 inline-block">
        &larr; Back to Archive
      </Link>
      
      <article className="prose dark:prose-invert lg:prose-xl max-w-none">
        <AnimatedHeading level={1} className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          {issue.title}
        </AnimatedHeading>
        
        <FadeIn delay={0.1} className="text-gray-500 mb-8 border-b pb-8">
          Published on {new Date(issue.publishedAt).toLocaleDateString()}
        </FadeIn>
        
        {issue.pdf && (
          <FadeIn delay={0.2} className="mb-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <h2 className="text-xl font-semibold mb-2">PDF Version Available</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              You can also read this issue as a high-quality PDF.
            </p>
            <a 
              href={issue.pdf.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Download PDF
            </a>
          </FadeIn>
        )}

        <FadeIn delay={0.3} className="text-lg text-gray-700 dark:text-gray-200">
          {issue.excerpt ? (
            <p>{issue.excerpt}</p>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl text-center italic text-gray-500">
              Full HTML content rendering would integrate with the CMS blocks here.
            </div>
          )}
        </FadeIn>
      </article>
    </main>
  );
}
