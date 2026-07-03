"use client";

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics/analytics';

export function OfferAnalyticsTracker({ offerId }: { offerId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      trackEvent({
        eventType: 'OFFER_VIEW',
        entityId: offerId,
        entityType: 'OFFER',
      });
      tracked.current = true;
    }
  }, [offerId]);

  return null;
}
