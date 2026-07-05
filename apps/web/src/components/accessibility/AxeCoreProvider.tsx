'use client';

import React, { useEffect } from 'react';

export function AxeCoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
      import('@axe-core/react').then((axe) => {
        import('react-dom').then((ReactDOM) => {
          axe.default(React, ReactDOM, 1000);
        });
      });
    }
  }, []);

  return <>{children}</>;
}
