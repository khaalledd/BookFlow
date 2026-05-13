'use client';

import { useEffect } from 'react';

export function WarmExploreData() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return;
    }

    fetch(`${apiUrl}/businesses?limit=100`, {
      method: 'GET',
      keepalive: true,
    }).catch(() => {
      // Silent warm-up only.
    });
  }, []);

  return null;
}
