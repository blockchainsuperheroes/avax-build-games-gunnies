import React from 'react';
import ModalOverlay from '../common/ModalOverlay';
import Image from 'next/image';

function ModalEvent({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onClose}
      className="w-full md:max-w-[1000px]"
      isShowCloseButton
    >
      <Image
        className="w-full h-full object-cover"
        src="/images/quests/banner-reward.png"
        alt="Event modal"
        width={1000}
        height={595}
      />
    </ModalOverlay>
  );
}

export default ModalEvent;
