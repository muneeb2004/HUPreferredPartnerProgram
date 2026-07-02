'use client';

import { useActionState } from 'react';

import { AnimatedButton, FadeIn } from '../../../../components/motion/MotionPrimitives';
import { subscribeAction } from '../../../actions/newsletter';

export function SubscriptionForm() {
  const [state, formAction, pending] = useActionState(subscribeAction, null);

  return (
    <FadeIn>
      <form action={formAction} className="flex flex-col gap-4 w-full max-w-md mx-auto" aria-live="polite">
        <label htmlFor="email" className="sr-only">Email Address</label>
        <div className="flex gap-2">
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={pending}
          />
          <AnimatedButton
            type="submit"
            disabled={pending}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? 'Subscribing...' : 'Subscribe'}
          </AnimatedButton>
        </div>
        
        {state?.error && (
          <p className="text-red-600 text-sm mt-1" role="alert">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-green-600 text-sm mt-1" role="alert">{state.success}</p>
        )}
      </form>
    </FadeIn>
  );
}
