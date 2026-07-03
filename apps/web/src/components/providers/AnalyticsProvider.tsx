"use client";

import React, { Suspense } from 'react';
import { useAnalytics } from '@/lib/analytics/useAnalytics';

function AnalyticsTracker() {
  useAnalytics(); // Auto-tracks PAGE_VIEW on route changes
  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
}
