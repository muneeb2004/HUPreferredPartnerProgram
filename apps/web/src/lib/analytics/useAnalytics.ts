import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent, AnalyticsEventType, AnalyticsEventPayload } from './analytics';

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTrackedPageView = useRef(false);

  // Expose manual track method for specific components
  const track = (payload: AnalyticsEventPayload, useBeacon = false) => {
    trackEvent(payload, useBeacon);
  };

  // Auto-track PAGE_VIEW on route changes
  useEffect(() => {
    // Prevent double-firing on strict mode mount
    if (!hasTrackedPageView.current) {
      trackEvent({
        eventType: 'PAGE_VIEW',
        metadata: {
          path: pathname,
          search: searchParams?.toString() || '',
          referrer: document.referrer,
        },
      });
      hasTrackedPageView.current = true;
    }
  }, [pathname, searchParams]);

  // Reset tracking state when path actually changes
  useEffect(() => {
    hasTrackedPageView.current = false;
  }, [pathname]);

  return { track };
}
