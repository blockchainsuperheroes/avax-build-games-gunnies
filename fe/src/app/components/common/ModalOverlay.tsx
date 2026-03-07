import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import Image from 'next/image';

interface ModalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  isShowCloseButton?: boolean;
}

export default function ModalOverlay({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  isShowCloseButton = false,
}: ModalOverlayProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          {isShowCloseButton && (
            <button
              type="button"
              className="absolute top-4 right-4 z-10"
              onClick={onClose}
            >
              <Image src="/assets/icons/x-circle.svg" alt="Close" width={36} height={36} />
            </button>
          )}
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
              <Dialog.Panel
                className={`w-full md:max-w-2xl transform overflow-hidden text-left align-middle shadow-xl transition-all ${className}`}
              >
                {title && (
                  <div className="py-4 px-2 border-b-[6px] border-[#f4ba0e]">
                    <Dialog.Title
                      style={{
                        background: '-webkit-linear-gradient(#ff8d02,#ff2d00)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                      as="h3"
                      className="text-3xl font-black leading-6 text-center italic font-batgrexo uppercase"
                    >
                      {title}
                    </Dialog.Title>
                  </div>
                )}

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
