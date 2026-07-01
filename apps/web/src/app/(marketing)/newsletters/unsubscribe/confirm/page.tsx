import { confirmUnsubscribeAction } from '../../../../actions/newsletter';
import { AnimatedHeading, FadeIn } from '../../../../../components/motion/MotionPrimitives';
import Link from 'next/link';

export default async function ConfirmUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams.token;
  let result = null;

  if (token) {
    result = await confirmUnsubscribeAction(token);
  }

  return (
    <main className="min-h-screen py-24 px-6 max-w-3xl mx-auto text-center">
      <AnimatedHeading level={1} className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Unsubscribe Confirmation
      </AnimatedHeading>

      <FadeIn delay={0.2} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        {!token ? (
          <p className="text-red-600">No unsubscribe token provided.</p>
        ) : result?.error ? (
          <p className="text-red-600">{result.error}</p>
        ) : (
          <div className="text-green-600">
            <h2 className="text-2xl font-semibold mb-4">Unsubscribed</h2>
            <p className="mb-6">{result?.success}</p>
            <Link 
              href="/" 
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return Home
            </Link>
          </div>
        )}
      </FadeIn>
    </main>
  );
}
