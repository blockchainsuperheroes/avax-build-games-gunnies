import React from 'react';
import { Tooltip } from '../common/Tooltip';

function ModalSelectOption({ onSignUp, onSkip }: { onSignUp: () => void; onSkip: () => void }) {
  return (
    <div className="bg-[url('/images/Burning-town.png')] bg-center bg-cover px-8 pt-16 pb-8">
      <p className="text-white text-2xl font-impact text-center">
        Getting starting with Gunnies? Sign up for a Avalanche Games account to be eligible for
        in-game and leaderboard rewards.
      </p>

      <div className="flex justify-center gap-4 w-full mt-8">
        <button
          className="bg-[#1CBBBC] text-white px-4 py-2 rounded-lg text-xl font-impact"
          onClick={onSignUp}
        >
          Sign up
        </button>
        <Tooltip content="I am just looking around" position="bottom-left" offsetX={-40} offsetY={-10}>
          <button className="text-white px-4 py-2 rounded-lg text-xl font-impact" onClick={onSkip}>
            Skip
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default ModalSelectOption;
