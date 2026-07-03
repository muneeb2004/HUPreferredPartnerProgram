export type AnalyticsEventType = 
  | 'PAGE_VIEW'
  | 'SEARCH_QUERY'
  | 'PARTNER_VIEW'
  | 'OFFER_VIEW'
  | 'OFFER_CLICK'
  | 'NEWSLETTER_SUBSCRIBE';

export interface AnalyticsEventPayload {
  eventType: AnalyticsEventType;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, any>;
}

const ANALYTICS_API_URL = '/api/v1/analytics/events';
const SESSION_KEY = 'hu_analytics_session';
const SESSION_EXPIRY_KEY = 'hu_analytics_session_expiry';
const SESSION_ROTATION_HOURS = 24;

/**
 * Retrieves or generates an anonymous session ID.
 * Rotates every 24 hours. Privacy compliant.
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return ''; // Not applicable in SSR

  const now = Date.now();
  const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId || !expiry || now > parseInt(expiry, 10)) {
    sessionId = crypto.randomUUID();
    const newExpiry = now + SESSION_ROTATION_HOURS * 60 * 60 * 1000;
    localStorage.setItem(SESSION_KEY, sessionId);
    localStorage.setItem(SESSION_EXPIRY_KEY, newExpiry.toString());
  }

  return sessionId;
}

/**
 * Fire-and-forget event dispatcher. Uses sendBeacon on unmount/unload, fetch otherwise.
 */
export function trackEvent(payload: AnalyticsEventPayload, useBeacon = false): void {
  if (typeof window === 'undefined') return; // Do not track on server

  const eventData = {
    eventId: crypto.randomUUID(),
    version: 1,
    eventType: payload.eventType,
    entityId: payload.entityId,
    entityType: payload.entityType,
    metadata: payload.metadata || {},
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
  };

  try {
    const blob = new Blob([JSON.stringify(eventData)], { type: 'application/json' });

    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon(ANALYTICS_API_URL, blob);
    } else {
      // Non-blocking fetch
      fetch(ANALYTICS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
        keepalive: true, // Similar guarantees to sendBeacon if supported
      }).catch(() => {
        // Silent catch: analytics should never crash the app
      });
    }
  } catch (error) {
    // Ignore all errors
  }
}
