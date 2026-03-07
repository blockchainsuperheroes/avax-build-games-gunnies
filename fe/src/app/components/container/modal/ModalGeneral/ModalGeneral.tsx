"use client";
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from "@headlessui/react";
import { Fragment } from "react";
import "./style.css";

type User = {
  name: string;
};

interface ModalGeneralProps {
  modalImage?: any;
  theme?: string;
  modalBody: JSX.Element;
  modalOpen: boolean;
  modalTitle: string | JSX.Element | any;
  modalDescription: string | JSX.Element | any;
  setModalOpen: (e: boolean) => void;
  isPadding?: boolean,
}


export const ModalGeneral = ({
  modalImage,
  modalOpen,
  setModalOpen,
  modalTitle,
  modalDescription,
  modalBody,
  theme,
  isPadding = true,
}: ModalGeneralProps) => (
  <Transition appear show={modalOpen} as={Fragment}>
    <Dialog
      as="div"
      className={`relative z-[300] ${theme ? theme : `bg-cinder`}`}
      onClose={setModalOpen}
    >
      <TransitionChild
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-[#00000066]" />
      </TransitionChild>

      <div className="fixed inset-0 overflow-y-auto">
        <div className={`${isPadding ? 'p-4' : ''} flex min-h-full items-center justify-center text-center`}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className={`w-full transform overflow-hidden space-y-6 rounded-2xl ${theme ? theme : `bg-cinder-300`
                } ${!modalImage && `p-0 `
                } text-left align-middle shadow-xl transition-all`}
            >
              {modalImage}

              <div className={`${modalImage && ``} grid gap-y-4`}>
                {modalTitle ? <div className={`space-y-2`}>
                  <DialogTitle
                    as="h3"
                    className={`text-[24px] mx-auto text-center leading-tight`}
                  >
                    {modalTitle}
                  </DialogTitle>
                  <div className="text-sm font-body text-center">
                    {modalDescription}
                  </div>
                </div>
                  : null}
                <div>{modalBody}</div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </Transition>
);
