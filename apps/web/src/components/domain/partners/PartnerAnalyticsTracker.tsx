"use client";

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics/analytics';

export function PartnerAnalyticsTracker({ partnerSlug }: { partnerSlug: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      trackEvent({
        eventType: 'PARTNER_VIEW',
        entityId: partnerSlug,
        entityType: 'PARTNER',
      });
      tracked.current = true;
    }
  }, [partnerSlug]);

  return null;
}
