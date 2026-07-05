'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function RouteAnnouncer() {
  const pathname = usePathname();
  const [routeAnnouncement, setRouteAnnouncement] = useState('');

  useEffect(() => {
    // Wait for the document title to update
    const timeout = setTimeout(() => {
      const pageTitle = document.title || 'HU Preferred Partner';
      setRouteAnnouncement(`Navigated to ${pageTitle}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {routeAnnouncement}
    </div>
  );
}
