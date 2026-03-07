// earlyaccessbutton.tsx
import React, { useState } from 'react';
import EarlyAccessModal from './EarlyAccessModal';
import Image from 'next/image';

const EarlyAccessButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="early-access  h-[4.5rem] rounded-lg mx-2 relative flex font-barlow text-white lg:w-88 hover:opacity-90 "
      >
        <Image
          src="/images/early.svg"
          alt="logo"
          width={92}
          height={71}
          className="absolute -top-[0.46rem]"
        />
        <div className="flex flex-col items-start mt-3 ml-24 lg:mr-4  leading-tight">
          <span className="font-medium"> SIGN UP FOR </span>
          <span className="font-bold text-2xl tracking-[0.3rem]	">EARLY ACCESS</span>
        </div>
      </button>
      {isModalOpen && (
        <EarlyAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default EarlyAccessButton;
