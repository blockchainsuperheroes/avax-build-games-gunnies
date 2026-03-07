'use client';

import React, { useState } from 'react';
import QuestsCardClaimed from './QuestsCardClaimed';
import QuestsCardAvalancheToClaim from './QuestsCardAvalancheToClaim';
import { useChestCount } from '@/hooks/useChestCount';
import { ChestUserType, REMAINING_CHESTS } from '@/app/constants/questsConfig';
import QuestModal from './QuestModal';

function QuestSectionAvalanche({ userType }: { userType: ChestUserType }) {
  const { claimed, remaining } = useChestCount({
    remainingChestType: REMAINING_CHESTS.AVAX,
    userType: userType,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chestDataRet, setChestDataRet] = useState(null);

  const handleOpenModal = (data: any) => {
    setChestDataRet(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap gap-6 max-w-[1569px] mx-auto justify-center my-4 md:my-10">
      <QuestModal isOpen={isModalOpen} onClose={handleCloseModal} chestDataRet={chestDataRet} />
      {Array.from({ length: claimed }).map((_, index) => (
        <QuestsCardClaimed key={`claimed_${index}`} />
      ))}
      {Array.from({ length: remaining }).map((_, index) => (
        <QuestsCardAvalancheToClaim
          key={`SKL_${index}`}
          questKey={`SKL_${index}`}
          userType={userType}
          onClaimSuccess={handleOpenModal}
        />
      ))}
    </div>
  );
}

export default QuestSectionAvalanche;
