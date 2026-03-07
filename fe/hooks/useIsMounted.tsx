'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Use Is Mounted
 */
export default function useIsMounted() {
  const [isMounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);
  return isMounted;
}
