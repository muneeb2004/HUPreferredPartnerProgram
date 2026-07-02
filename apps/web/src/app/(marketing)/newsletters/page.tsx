import Link from 'next/link';

import { FadeIn, AnimatedHeading, AnimatedCard, StaggerGroup } from '../../../components/motion/MotionPrimitives';

import { SubscriptionForm } from './components/SubscriptionForm';

export const revalidate = 60; // ISR revalidation every 60s

interface Newsletter {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  excerpt?: string | null;
  pdf?: { url: string } | null;
}

interface NewslettersResponse {
  data: Newsletter[];
}

async function getNewsletters(): Promise<NewslettersResponse> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  try {
    const res = await fetch(`${API_URL}/newsletters`, { next: { revalidate: 60 } });
    if (!res.ok) return { data: [] };
    const json = (await res.json()) as unknown;
    return json as NewslettersResponse;
  } catch (error) {
    return { data: [] };
  }
}

export default async function NewslettersArchivePage(): Promise<React.ReactElement> {
  const { data: newsletters } = await getNewsletters();

  return (
    <main className="min-h-screen py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <AnimatedHeading level={1} className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Newsletter Archive
        </AnimatedHeading>
        <FadeIn delay={0.2} className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Stay updated with the latest from the Habib University Preferred Partner Platform. Subscribe below or browse our previous issues.
        </FadeIn>
        
        <SubscriptionForm />
      </div>

      <div className="mt-20">
        <AnimatedHeading level={2} className="text-2xl font-bold mb-8 text-gray-900 dark:text-white border-b pb-4">
          Past Issues
        </AnimatedHeading>

        {newsletters.length === 0 ? (
          <FadeIn className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p>No published newsletters found. Please check back later.</p>
          </FadeIn>
        ) : (
          <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newsletters.map((issue: Newsletter) => (
              <AnimatedCard key={issue.id} className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                <Link href={`/newsletters/${issue.slug}`} className="block h-full">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                    {new Date(issue.publishedAt).toLocaleDateString()}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {issue.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                    {issue.excerpt || 'Read the full issue online.'}
                  </p>
                </Link>
              </AnimatedCard>
            ))}
          </StaggerGroup>
        )}
      </div>
    </main>
  );
}
