import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ButtonIcon } from './ButtonIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  isShowCloseButton?: boolean;
  isBorderColor?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  isShowCloseButton = false,
  isBorderColor = false,
}: ModalProps) {
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
          <div className={`fixed inset-0 ${!isBorderColor ? 'bg-black/50' : 'bg-black/90'}  backdrop-blur-sm`} />
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
              <Dialog.Panel
                className={`w-full md:max-w-2xl transform overflow-hidden text-left align-middle shadow-xl transition-all ${className}  ${!isBorderColor ? 'border-2 border-[#f4ba0e] bg-black' : 'border-sign-up-and-dive-in bg-black'}`}
              >
                {isShowCloseButton && (
                  !isBorderColor ?
                  <button
                    type="button"
                    className={`absolute top-4 right-4 rounded-full p-1 bg-[#FE3300] transition-colors z-10`}
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6 text-white" />
                  </button>
                  :  <ButtonIcon
                      onClick={onClose}
                      twBgIcon="bg-ic-close-black"
                      className="absolute top-4 right-4 z-10 w-[24px] h-[24px] cursor-pointer"
                    />
                )}

                {title && (
                  <div className={`py-4 px-2  ${!isBorderColor ? 'border-[#f4ba0e] border-b-[6px]' : 'border-sign-up-and-dive-in backdrop-blur-[32px]'}`}>
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
