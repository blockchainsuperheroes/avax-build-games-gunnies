'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-middle'
    | 'bottom-middle'
    | 'left-middle'
    | 'right-middle';
  className?: string;
  delay?: number;
  offset?: number;
  offsetX?: number;
  offsetY?: number;
  containerClassName?: string;
  allowWrap?: boolean;
  tooltipWidth?: string;
  wrapperClassName?: string;
  showArrow?: boolean;
}

export const Tooltip = ({
  children,
  content,
  position = 'top',
  className = '',
  delay = 0.2,
  offset = 10,
  offsetX = 0,
  offsetY = 0,
  containerClassName = '',
  allowWrap = false,
  tooltipWidth = 'auto',
  wrapperClassName = '',
  showArrow = true,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; transform: string }>({
    top: 0,
    left: 0,
    transform: '',
  });
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;
      let transform = '';

      switch (position) {
        case 'top':
        case 'top-middle':
          top = rect.top - offset;
          left = rect.left + rect.width / 2;
          transform = 'translateX(-50%)';
          break;
        case 'bottom':
        case 'bottom-middle':
          top = rect.bottom + offset;
          left = rect.left + rect.width / 2;
          transform = 'translateX(-50%)';
          break;
        case 'left':
        case 'left-middle':
          top = rect.top + rect.height / 2;
          left = rect.left - offset;
          transform = 'translateY(-50%)';
          break;
        case 'right':
        case 'right-middle':
          top = rect.top + rect.height / 2;
          left = rect.right + offset;
          transform = 'translateY(-50%)';
          break;
        case 'top-left':
          top = rect.top - offset;
          left = rect.left;
          transform = 'none';
          break;
        case 'top-right':
          top = rect.top - offset;
          left = rect.right;
          transform = 'translateX(-100%)';
          break;
        case 'bottom-left':
          top = rect.bottom + offset;
          left = rect.left;
          transform = 'none';
          break;
        case 'bottom-right':
          top = rect.bottom + offset;
          left = rect.right;
          transform = 'translateX(-100%)';
          break;
        default:
          break;
      }

      setCoords({
        top: top + offsetY,
        left: left + offsetX,
        transform,
      });
    }
  }, [isVisible, offset, offsetX, offsetY, position]);

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);

  const getArrowPosition = (position: TooltipProps['position']) => {
    switch (position) {
      case 'top':
      case 'top-middle':
      case 'top-left':
      case 'top-right':
        return 'bottom-[-4px] left-1/2 -translate-x-1/2';
      case 'bottom':
      case 'bottom-middle':
      case 'bottom-left':
      case 'bottom-right':
        return 'top-[-4px] left-1/2 -translate-x-1/2';
      case 'left':
      case 'left-middle':
        return 'right-[-4px] top-1/2 -translate-y-1/2';
      case 'right':
      case 'right-middle':
        return 'left-[-4px] top-1/2 -translate-y-1/2';
      default:
        return '';
    }
  };

  const TooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, delay }}
          className={`z-[9999] fixed ${className}`}
          style={{
            top: coords.top,
            left: coords.left,
            transform: coords.transform,
            pointerEvents: 'none',
            width: tooltipWidth,
          }}
        >
          <div
            className={`bg-black/90 text-white px-3 py-2 rounded-lg text-sm ${wrapperClassName} ${
              allowWrap ? '' : 'whitespace-nowrap'
            } text-center relative`}
          >
            {content}
            {showArrow && (
              <div
                className={`absolute w-2 h-2 bg-black/90 rotate-45 ${getArrowPosition(position)}`}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      ref={triggerRef}
      className={`inline-block ${containerClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {typeof window !== 'undefined' && createPortal(TooltipContent, document.body)}
    </div>
  );
};
