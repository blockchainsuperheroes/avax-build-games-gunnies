import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  className?: string;
  isShowCloseButton?: boolean;
}

export default function ModalConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  className = '',
  isShowCloseButton = false,
}: ModalConfirmationProps) {
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
              <Dialog.Panel
                className={`w-full max-w-lg transform overflow-hidden bg-black text-left align-middle shadow-xl transition-all ${className} border-2 border-[#f4ba0e]`}
              >
                {isShowCloseButton && (
                  <button
                    type="button"
                    className="absolute top-4 right-4 rounded-full p-1 bg-[#FE3300] transition-colors"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6 text-white" />
                  </button>
                )}

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

                <div className="p-6">
                  {description && <p className="text-center text-lg text-white font-impact">{description}</p>}

                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      type="button"
                      className={`inline-flex justify-center rounded-md border border-[#10ff00] px-12 py-2 text-lg font-medium text-[#10ff00] font-impact`}
                      onClick={onConfirm}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        confirmText
                      )}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-[#fa0000] px-12 py-2 text-lg font-medium text-[#fa0000] font-impact"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      {cancelText}
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
