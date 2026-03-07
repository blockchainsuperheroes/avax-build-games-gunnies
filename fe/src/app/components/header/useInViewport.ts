import React, { RefObject, useEffect, useMemo, useState } from 'react';

export const useInViewport = (ref: RefObject<HTMLElement | any>) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const observer: any = useMemo(() => {
    if (ref && typeof window !== 'undefined') {
      const result = new window.IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
      );
      return result;
    }
  }, [ref]);

  useEffect(() => {
    if (observer) {
      observer.observe(ref?.current);
      return () => observer.disconnect();
    }
  }, []);

  return isIntersecting;
};
