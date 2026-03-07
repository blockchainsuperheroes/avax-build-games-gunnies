import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  description?: string;
  className?: string;
  children?: ReactNode;
  chestDataRet: any;
}

const rewardIcons: Record<string, any> = {
  coins: {
    src: '/images/quests/gcoin.png',
    alt: 'Coins',
    width: 36,
    height: 36,
  },
  stars: {
    src: '/images/quests/star-circle.png',
    alt: 'Stars',
    width: 36,
    height: 36,
  },
  usdt: {
    src: '/images/quests/usdt.png',
    alt: 'USDT',
    width: 46,
    height: 46,
  },
  khaos: {
    src: '/images/quests/xkhao.png',
    alt: 'Khaos',
    width: 46,
    height: 46,
  },
  carrots: {
    src: '/images/quests/carrot.png',
    alt: 'Carrots',
    width: 40,
    height: 52,
  },
};

export default function QuestModal({
  isOpen,
  onClose,
  className = '',
  chestDataRet: chestData,
}: QuestModalProps) {
  if (!chestData) return null;

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
                <button
                  type="button"
                  className="absolute top-3 right-4 rounded-full p-1 bg-[#FE3300] transition-colors"
                  onClick={onClose}
                >
                  <XMarkIcon className="h-6 w-6 text-white" />
                </button>

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
                    Rewards
                  </Dialog.Title>
                </div>

                <div className="p-6">
                  {chestData?.status ? (
                    <div className="flex items-center justify-center gap-4">
                      {/* <p className="text-[#FD3300] font-normal text-6xl font-[PopulationZeroBB] [text-shadow:0px_6px_0px_white,-3px_6px_0px_white,-5px_0px_0px_white,-5px_-4px_0px_white,-1px_-5px_0px_white,3px_5px_0px_white,3px_-4px_0px_white] text-center">
                        {chestData.reward.reward_value}
                      </p> */}
                      <p className="text-[#FD3300] font-normal text-6xl font-batgrexo text-center">
                        {chestData.reward.reward_value}
                      </p>
                      <Image
                        src={
                          rewardIcons[chestData.reward.reward_type]?.src ||
                          '/images/quests/default.png'
                        }
                        alt={rewardIcons[chestData.reward.reward_type]?.alt || 'Reward'}
                        width={rewardIcons[chestData.reward.reward_type]?.width || 36}
                        height={rewardIcons[chestData.reward.reward_type]?.height || 36}
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-white text-2xl font-normal font-[PopulationZeroBB] [text-shadow:_1px_4px_0px_black,-3px_4px_0px_black,3px_4px_0px_black,4px_3px_0px_black,4px_-1px_0px_black,4px_-3px_0px_black,0px_-3px_0px_black,-3px_-1px_0px_black,-3px_-3px_0px_black,-2px_6px_0px_#FE3300,2px_6px_0px_#FE3300,4px_6px_0px_#FE3300,7px_6px_0px_#FE3300;] text-center">
                        You have exhausted your quota of rewards
                      </p>
                      <p className="text-white font-normal text-2xl font-[PopulationZeroBB] [text-shadow:_1px_4px_0px_black,-3px_4px_0px_black,3px_4px_0px_black,4px_3px_0px_black,4px_-1px_0px_black,4px_-3px_0px_black,0px_-3px_0px_black,-3px_-1px_0px_black,-3px_-3px_0px_black,-2px_6px_0px_#FE3300,2px_6px_0px_#FE3300,4px_6px_0px_#FE3300,7px_6px_0px_#FE3300;] text-center">
                        Time Remaining: {chestData?.time_remaining}
                      </p>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
