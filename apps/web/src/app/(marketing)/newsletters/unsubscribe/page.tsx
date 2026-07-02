import { UnsubscribeForm } from '../../../../components/marketing/UnsubscribeForm';
import { AnimatedHeading, FadeIn } from '../../../../components/motion/MotionPrimitives';

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}): Promise<React.ReactElement> {
  const resolvedSearchParams = await searchParams;
  const defaultEmail = resolvedSearchParams.email || '';

  return (
    <main className="min-h-screen py-24 px-6 max-w-3xl mx-auto text-center">
      <AnimatedHeading level={1} className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Unsubscribe
      </AnimatedHeading>

      <FadeIn delay={0.2} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-md mx-auto">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We&apos;re sorry to see you go. Enter your email below to unsubscribe.
        </p>

        <UnsubscribeForm defaultEmail={defaultEmail} />
      </FadeIn>
    </main>
  );
}
