'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';

interface PlatformSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSteamClick?: () => void;
  onEpicClick?: () => void;
}

export default function PlatformSelectModal({
  isOpen,
  onClose,
  onSteamClick,
  onEpicClick,
}: PlatformSelectModalProps) {
  const handleSteamClick = () => {
    onSteamClick?.();
    onClose();
  };

  const handleEpicClick = () => {
    onEpicClick?.();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden transition-all relative">
                {/* Background with game characters */}
                <div className="relative min-h-[298px] flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden">
                  {/* Title */}
                  <h2 className="text-white text-2xl md:text-5xl font-bold uppercase mb-4 md:mb-12 relative z-10 text-center">
                    CHOOSE YOUR PLATFORM
                  </h2>

                  {/* Platform Options */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-16 relative z-10">
                    {/* Steam Option */}
                    <button
                      onClick={handleSteamClick}
                      className="group flex flex-col items-center gap-4 p-6 rounded-lg hover:bg-white/10 transition-all border-2 border-transparent hover:border-white/30 relative"
                    >
                      <Image src="/images/steam.png" alt="Steam" width={385} height={125} />
                    </button>

                    {/* Epic Games Option */}
                    <button
                      onClick={handleEpicClick}
                      className="group flex flex-col items-center gap-4 p-6 rounded-lg hover:bg-white/10 transition-all border-2 border-transparent hover:border-white/30 relative"
                    >
                      <Image src="/images/epic.png" alt="Epic Games" width={161} height={187} className='w-[120px] md:w-[161px] h-[134px] md:h-[187px]' />
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
