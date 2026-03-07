import React from 'react';
import Modal from './Modal';

function ModalDownload({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isShowCloseButton title="Download Web3 Launcher">
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-xl font-charka text-center text-white">
          Games completed on the Web3 version contributes to your rank on the leaderboard. <br />{' '}
          Shoot - Loot - Repeat
        </p>
        <button
          className="bg-[#1CBBBC] rounded-lg px-4 py-2 w-full"
          onClick={() => {
            window.open(process.env.NEXT_PUBLIC_DOWNLOAD_LINK, '_blank');
          }}
        >
          <p className="text-xl text-white font-bold font-charka">DOWNLOAD NOW</p>
        </button>
      </div>
    </Modal>
  );
}

export default ModalDownload;
