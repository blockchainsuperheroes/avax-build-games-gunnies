import { useCallback } from 'react';
import { event } from '@/lib/gtag';

export const useGoogleAnalytics = () => {
  const trackEvent = useCallback((
    action: string,
    options?: {
      event_category?: string;
      event_label?: string;
      value?: number;
    }
  ) => {
    event(action, options || {});
  }, []);

  const trackWalletConnection = useCallback((walletName: string, success: boolean) => {
    trackEvent(success ? 'wallet_connect_success' : 'wallet_connect_failed', {
      event_category: 'authentication',
      event_label: walletName,
    });
  }, [trackEvent]);

  const trackNFTMint = useCallback((nftType: string, success: boolean, price?: number) => {
    trackEvent(success ? 'nft_mint_success' : 'nft_mint_failed', {
      event_category: 'nft',
      event_label: nftType,
      value: price,
    });
  }, [trackEvent]);

  const trackQuestComplete = useCallback((questType: string, success: boolean) => {
    trackEvent(success ? 'quest_complete_success' : 'quest_complete_failed', {
      event_category: 'quests',
      event_label: questType,
    });
  }, [trackEvent]);

  const trackGameLaunch = useCallback((platform: string) => {
    trackEvent('game_launch', {
      event_category: 'engagement',
      event_label: platform,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackWalletConnection,
    trackNFTMint,
    trackQuestComplete,
    trackGameLaunch,
  };
};
