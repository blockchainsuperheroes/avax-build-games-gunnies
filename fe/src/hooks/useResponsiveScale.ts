// hooks/useResponsiveScale.ts
import { useEffect, useState } from 'react';

export function useResponsiveScale<T extends HTMLElement>(
  {
    ref,
    baseWidth = 1920,
    minWidth = 768,
    scaleOverride,
  }: {
    ref: React.RefObject<T>;
    baseWidth?: number;
    minWidth?: number;
    scaleOverride?: number;
  }
) {
  const [isScaled, setIsScaled] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function scaleDesign() {
      const screenWidth = window.innerWidth;

      if (!ref.current) return;

      if (scaleOverride && screenWidth > 1280) {
        ref.current.style.transform = `scale(${scaleOverride})`;
        ref.current.style.transformOrigin = 'top center';
        ref.current.style.width = `${baseWidth}px`;
        setScale(scaleOverride);
        setIsScaled(true);
        return;
      }

      if (screenWidth < minWidth) {
        ref.current.style.transform = 'none';
        ref.current.style.width = '100%';
        setScale(1);
      } else {
        const autoScale = screenWidth / baseWidth;
        if (autoScale < 1) {
          ref.current.style.transform = `scale(${autoScale})`;
          ref.current.style.transformOrigin = 'top left';
          ref.current.style.width = `${baseWidth}px`;
          setScale(autoScale);
        } else {
          ref.current.style.transform = 'none';
          ref.current.style.width = '100%';
          setScale(1);
        }
      }

      setIsScaled(true);
    }

    scaleDesign();
    window.addEventListener('resize', scaleDesign);
    return () => window.removeEventListener('resize', scaleDesign);
  }, [ref, baseWidth, minWidth, scaleOverride]);

  return { isScaled, scale };
}
