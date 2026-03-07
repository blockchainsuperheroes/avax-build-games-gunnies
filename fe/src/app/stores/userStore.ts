import { create } from 'zustand'

interface UserStore {
  rewards: any;
  fetchRewards: (newData: any) => void;
  leaderboard: any;
  updateLeaderboard: (newData: any) => void;
  isAnyCardPending: boolean;
  setIsAnyCardPending: (value: boolean) => void;
}

const useStore = create<UserStore>((set) => ({
  rewards: null,
  fetchRewards: (newData: any) => set({ rewards: newData }),
  leaderboard: null,
  updateLeaderboard: (newData: any) => set({ leaderboard: newData }),
  isAnyCardPending: false,
  setIsAnyCardPending: (value: boolean) => set({ isAnyCardPending: value }),
}));

export default useStore;