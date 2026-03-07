'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';

interface GameGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameGuideModal = ({ isOpen, onClose }: GameGuideModalProps) => {
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
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden  shadow-xl transition-all">
                {/* Content */}
                <div className="p-4 md:p-6">
                  <div className="w-full h-[70vh] md:h-[80vh]">
                    <iframe
                      src="/downloads/game-guide.pdf#navpanes=0"
                      className="w-full h-full border-0 rounded-lg"
                      title="Game Guide PDF"
                      allow="fullscreen"
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <a
                      href="/downloads/game-guide.pdf"
                      download="Game Guide.pdf"
                      className="px-6 py-3 flex items-center justify-center gap-2 bg-white text-black font-sora font-semibold rounded-lg transition-colors text-xl"
                    >
                      Download
                      <Image width={24} height={24} src="/images/download.svg" alt="Download" />
                    </a>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
