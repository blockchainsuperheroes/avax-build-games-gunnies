'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ROUTES } from '@/app/constants/routes';
import clsx from 'clsx';
import { GameGuideModal } from './GameGuideModal';
import { useGlobalContext } from '@/app/providers/GlobalProvider';

interface PlayNowDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
  onItemClick?: () => void;
  onCurrentEventClick?: () => void;
  onHover?: () => void;
}

interface DropdownItem {
  title: string;
  route?: string;
  onClick?: () => void;
}

export const PlayNowDropdown = ({
  isOpen,
  onClose,
  triggerRef,
  onItemClick,
  onCurrentEventClick,
  onHover,
}: PlayNowDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isGameGuideModalOpen, setIsGameGuideModalOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showBannerModal } = useGlobalContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);

      // Calculate position
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 8,
          left: rect.left,
        });
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isOpen, onClose, triggerRef]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    onHover?.();
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleGameGuideClick = () => {
    setIsGameGuideModalOpen(true);
    onItemClick?.();
    onClose();
  };

  const dropdownItems: DropdownItem[] = [
    {
      title: 'Download',
      route: ROUTES.DOWNLOAD,
    },
    {
      title: 'Know Your Rewards',
      route: ROUTES.GET_STARTED,
    },
    {
      title: 'Current Event',
      route: ROUTES.CURRENT_EVENT,
    },
    {
      title: 'Line Up & More',
      route: ROUTES.LINEUP_AND_MORE,
    },

    {
      title: 'Gunnies NFT Cards',
      route: ROUTES.NFT_CARDS,
    },
    {
      title: 'Gunnies in Spatial',
      onClick: showBannerModal,
    },
    {
      title: 'Game Guide',
      onClick: handleGameGuideClick,
    },
  ];

  return (
    <>
      {isOpen && (
        <AnimatePresence>
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block fixed bg-[#222222] backdrop-blur-sm rounded-lg px-2 py-2 z-[100] min-w-[200px]"
            style={{
              top: position.top,
              left: position.left,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {dropdownItems.map((item, index) => {
              const itemClassName = clsx(
                'px-4 py-2 rounded-md cursor-pointer transition-colors block',
                'hover:bg-[#1CBBBC] hover:text-black',
                'text-white text-sm font-chakra'
              );

              if (item.route && !item.onClick) {
                return (
                  <Link
                    key={index}
                    href={item.route}
                    onClick={() => {
                      onItemClick?.();
                      onClose();
                    }}
                    className={itemClassName}
                  >
                    {item.title}
                  </Link>
                );
              }

              return (
                <div
                  key={index}
                  className={itemClassName}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      onItemClick?.();
                      onClose();
                    }
                  }}
                >
                  {item.title}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
      <GameGuideModal
        isOpen={isGameGuideModalOpen}
        onClose={() => setIsGameGuideModalOpen(false)}
      />
    </>
  );
};
