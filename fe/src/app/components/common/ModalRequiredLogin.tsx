import React from 'react';
import Modal from './Modal';
import Image from 'next/image';

function ModalRequiredLogin({
  isOpen,
  onClose,
  onSignUp,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="You may get">
      <div className="p-6">
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center justify-start gap-4">
            <Image
              className="w-[48px] h-[53px]"
              src="/images/quests/star-circle.png"
              alt="Star"
              width={64}
              height={64}
            />

            <div>
              <p className="text-white text-xl font-semibold font-chakra uppercase">Star</p>
              <p className="text-white font-semibold font-chakra uppercase">5-40</p>
            </div>
          </div>
          <div className="flex items-center justify-start gap-4">
            <Image
              className="w-[38px] h-[53px]"
              src="/images/quests/carrot.png"
              alt="Carrot"
              width={66}
              height={96}
            />

            <div>
              <p className="text-white font-semibold font-chakra uppercase">Karrot</p>
              <p className="text-white font-semibold font-chakra uppercase">10-100</p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-4">
            <Image
              className="w-[68px] h-[68px]"
              src="/images/quests/xkhao.png"
              alt="xKhao"
              width={119}
              height={119}
            />
            <div>
              <p className="text-white text-xl font-semibold font-chakra">xKHAOS</p>
              <p className="text-white font-semibold font-chakra uppercase">100000</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-8 mt-4">
          <div className="flex items-center justify-center gap-4">
            <div className="w-[65px]">
              <Image
                className="w-[48px] h-[53px]"
                src="/images/quests/gcoin.png"
                alt="G Coin"
                width={84}
                height={92}
              />
            </div>

            <div>
              <p className="text-white text-xl font-semibold font-chakra uppercase">Coin</p>
              <p className="text-white font-semibold font-chakra uppercase">10-40</p>
            </div>
          </div>

          <div className="flex items-center justify-start gap-4">
            <div className="w-[65px]">
              <Image
                className="w-[64px] h-[61px]"
                src="/images/quests/usdt.png"
                alt="USDT"
                width={119}
                height={106}
              />
            </div>

            <div>
              <p className="text-white text-xl font-semibold font-chakra">USDT</p>
              <p className="text-white font-semibold font-chakra uppercase">250</p>
            </div>
          </div>
        </div>

        <p className="text-white text-2xl font-bold font-chakra text-center mt-4">
          Sign up on Avalanche Games and create your account to be eligible for in-game and leaderboard
          rewards.
        </p>

        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            className="text-white px-4 py-2 rounded-md bg-[#1CBBBC] text-lg font-chakra"
            onClick={onSignUp}
          >
            Sign up
          </button>
          <button
            className="bg-transparent text-white px-4 py-2 text-lg font-chakra"
            onClick={onClose}
          >
            Later
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ModalRequiredLogin;
