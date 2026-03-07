'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Web3Provider } from './Web3Provider';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { GlobalProvider } from './GlobalProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true} // Refetch session when window regains focus
      refetchWhenOffline={false} // Don't refetch when offline
    >
      <Web3Provider>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <GlobalProvider>
              <ToastContainer limit={3} theme="dark" position="bottom-right" />
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </GlobalProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </Web3Provider>
    </SessionProvider>
  );
}
