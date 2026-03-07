import React from 'react';
import ModalOverlay from '../common/ModalOverlay';
import Image from 'next/image';
import clsx from 'clsx';
interface RewardsTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RewardRow {
  rank: number | string;
  avax: number;
  avalanche: number;
  usdt: number | string;
}

const RewardsTableModal: React.FC<RewardsTableModalProps> = ({ isOpen, onClose }) => {
  const rewardsData: RewardRow[] = [
    { rank: 1, avax: 15000, avalanche: 3, usdt: 100 },
    { rank: 2, avax: 8000, avalanche: 1.6, usdt: 60 },
    { rank: 3, avax: 5000, avalanche: 1, usdt: 50 },
    { rank: 4, avax: 3000, avalanche: 0.6, usdt: 30 },
    { rank: 5, avax: 1500, avalanche: 0.3, usdt: 10 },
    { rank: '6~10', avax: 1000, avalanche: 0.2, usdt: '-' },
    { rank: '11~20', avax: 500, avalanche: 0.1, usdt: '-' },
    { rank: '21~50', avax: 250, avalanche: 0.05, usdt: '-' },
  ];

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} className="w-full md:max-w-[924px]">
      <div className="rounded-2xl border border-white p-5 md:p-10 relative bg-black">
        {/* Modal Header */}
        <p className="text-2xl md:text-[40px] font-chakra text-[#1CBBBB] font-bold text-center">
          SEASON 1 REWARDS TABLE
        </p>

        <button
          className="absolute top-4 right-4 z-10 border border-white rounded-full p-1.5"
          onClick={onClose}
        >
          <Image src="/assets/icons/ic-close.svg" alt="Close" width={12} height={12} />
        </button>

        {/* Modal Content */}
        <div className="mt-4 md:mt-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                {/* Main header row */}
                <tr>
                  <th rowSpan={1} className="bg-[#191919] min-w-[82px]"></th>
                  <th
                    colSpan={2}
                    className="bg-[#191919] text-white font-sora p-2.5 text-center border-l border-[#838383] font-normal"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Image src="/assets/icons/avax.svg" alt="Avalanche" width={20} height={20} />
                      <span className="text-sm">Avalanche Tokens Reward</span>
                    </div>
                  </th>
                  <th
                    colSpan={2}
                    className="bg-[#191919] text-white font-sora p-2.5 text-center border-l border-[#838383] font-normal"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Image
                        src="/assets/icons/avalanche.svg"
                        alt="Avalanche"
                        width={20}
                        height={20}
                      />
                      <span className="text-sm">Avalanche Reward</span>
                    </div>
                  </th>
                  <th
                    colSpan={2}
                    className="bg-[#191919] text-white font-sora p-2.5 text-center border-l border-[#838383] font-normal"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Image src="/assets/icons/usdt.svg" alt="USDT" width={20} height={20} />
                      <span className="text-sm">USDT Reward</span>
                    </div>
                  </th>
                </tr>
                {/* Sub header row */}
                <tr>
                  <th className="bg-[#FF8F00] text-white font-sora p-3 text-center text-xs font-normal">
                    Top
                  </th>
                  <th className="bg-[#474747] text-white font-sora p-3 text-center border-l border-[#838383] text-xs font-normal">
                    Reward
                  </th>
                  <th className="bg-[#474747] text-white font-sora p-3 text-left text-xs font-normal">
                    Extra rewards with
                    <br />
                    Kaboom pass
                  </th>
                  <th className="bg-[#474747] text-white font-sora p-3 text-center border-l border-[#838383] text-xs font-normal">
                    Reward
                  </th>
                  <th className="bg-[#474747] text-white font-sora p-3 text-left text-xs font-normal">
                    Extra rewards with
                    <br />
                    Kaboom pass
                  </th>
                  <th className="bg-[#474747] text-white font-sora p-3 text-center border-l border-[#838383] text-xs font-normal">
                    Reward
                  </th>
                  <th className="bg-[#474747] text-white font-sora p-3 text-left text-xs font-normal">
                    Extra rewards with
                    <br />
                    Kaboom pass
                  </th>
                </tr>
              </thead>
              <tbody>
                {rewardsData.map((row, index) => {
                  const medalEmoji =
                    row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : '';

                  const bgColor = index % 2 === 0 ? 'bg-[#6C6C6C]' : 'bg-[#474747]';
                  const isLowRank = index > 4;
                  const cellPadding = isLowRank ? 'py-1.5' : 'py-2';
                  const styleText = isLowRank
                    ? 'text-base font-normal text-[#A19C9C]'
                    : 'text-xl font-bold text-white';

                  return (
                    <tr key={index} className="hover:bg-gray-800/50">
                      <td
                        className={clsx(
                          'bg-[#FF8F00] text-white font-sora font-normal px-4 text-center',
                          cellPadding,
                          styleText
                        )}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {medalEmoji && <span className="text-lg">{medalEmoji}</span>}
                          <span>{typeof row.rank === 'number' ? `${row.rank}` : row.rank}</span>
                        </div>
                      </td>
                      <td
                        className={clsx(
                          'font-charka px-2.5 text-left border-l border-[#838383]',
                          bgColor,
                          cellPadding,
                          styleText
                        )}
                      >
                        {row.avax.toLocaleString()}
                      </td>
                      <td
                        className={clsx(
                          'font-charka px-2.5 text-left',
                          bgColor,
                          cellPadding,
                          styleText
                        )}
                      >
                        {row.avax.toLocaleString()}
                      </td>
                      <td
                        className={clsx(
                          'font-charka px-2.5 text-left border-l border-[#838383]',
                          bgColor,
                          cellPadding,
                          styleText
                        )}
                      >
                        {row.avalanche}
                      </td>
                      <td
                        className={clsx(
                          'font-charka px-2.5 text-left',
                          bgColor,
                          cellPadding,
                          styleText
                        )}
                      >
                        {row.avalanche}
                      </td>
                      <td
                        className={clsx(
                          'font-charka px-2.5 text-left border-l border-[#838383]',
                          bgColor,
                          cellPadding,
                          styleText
                        )}
                      >
                        {row.usdt}
                      </td>
                      <td
                        className={clsx(
                          'font-charka px-2.5 text-left',
                          bgColor,
                          cellPadding,
                          styleText
                        )}
                      >
                        {row.usdt}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-white text-sm font-sora text-center mt-4 font-light">
            Price fluctuations may affect the final value of game rewards.
          </p>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default RewardsTableModal;
