'use client';

import { useActionState } from 'react';

import { unsubscribeAction } from '../../app/actions/newsletter';
import { AnimatedButton } from '../motion/MotionPrimitives';

import type * as React from "react";

export function UnsubscribeForm({ defaultEmail }: { defaultEmail: string }): React.JSX.Element {
  const [state, formAction, isPending] = useActionState(unsubscribeAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input
        type="email"
        name="email"
        defaultValue={defaultEmail}
        required
        placeholder="Enter your email"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
      {state?.success && <p className="text-green-500 text-sm">{state.success}</p>}

      <AnimatedButton
        type="submit"
        disabled={isPending}
        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
      >
        {isPending ? 'Unsubscribing...' : 'Unsubscribe'}
      </AnimatedButton>
    </form>
  );
}
