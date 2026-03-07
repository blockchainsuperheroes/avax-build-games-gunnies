'use client';

import { useRef, useEffect, Fragment } from 'react';
import Banner from '../components/leaderboard/Banner';
import Row from '../components/leaderboard/Row';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useResponsiveScale } from '@/hooks/useResponsiveScale';
import { useInView } from 'react-intersection-observer';

export default function Page() {
  const { status: sessionStatus, data: session }: any = useSession();
  const queryClient = useQueryClient();
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { isScaled, scale } = useResponsiveScale({ ref: sectionRef, scaleOverride: 0.8 });

  const { ref, inView } = useInView();

  const fetchLeaderboard = async ({ pageParam = 1 }) => {
    const publicUrl = `${process.env.NEXT_PUBLIC_GUNNIES_API}/stars/leaderboard/public?page=${pageParam}`;
    const authUrl = `${process.env.NEXT_PUBLIC_GUNNIES_API}/stars/leaderboard?page=${pageParam}`;
    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const fetchWithUrl = async (url: string, headers: Record<string, string>) => {
      const response = await fetch(url, { method: 'GET', headers });
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      return response.json();
    };

    if (sessionStatus === 'authenticated') {
      try {
        return await fetchWithUrl(authUrl, {
          ...baseHeaders,
          Authorization: `Bearer ${session.user.gunnies_access_token}`,
        });
      } catch {
        return fetchWithUrl(publicUrl, baseHeaders);
      }
    }

    return fetchWithUrl(publicUrl, baseHeaders);
  };

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['repoData', sessionStatus],
      enabled: sessionStatus === 'authenticated' || sessionStatus === 'unauthenticated',
      queryFn: fetchLeaderboard,
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = allPages.length;
        const totalPages = lastPage?.result?.total_page;
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      initialPageParam: 1,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div ref={wrapperRef} className="xl:flex xl:justify-center" style={{ overflow: 'hidden' }}>
      <section
        ref={sectionRef}
        className={`w-full max-w-[1920px] mx-auto px-3 md:px-16 transition-opacity duration-200 ${
          isScaled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Banner />

        {error && (
          <div className="flex flex-col items-center mt-32">
            <h1 className="text-2xl font-bold text-red-500">Error: {error.message}</h1>
            <p className="text-lg text-gray-700">Please try again later.</p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center">
            <Image
              className="mt-10 jumpy"
              src="/images/quests/carrot.png"
              alt="loading"
              width={60}
              height={60}
            />
          </div>
        )}

        <div className="flex flex-col gap-4 md:gap-8 py-8 md:py-12 min-h-[calc(100vh-500px)]">
          {data?.pages[0]?.result?.my_data && (
            <Row
              rank={data.pages[0].result.my_data.rank}
              player={data.pages[0].result.my_data.username}
              collectedStar={data.pages[0].result.my_data?.total_count}
              currentPlayer={true}
            />
          )}

          {data?.pages.map((page, pageIndex) => (
            <Fragment key={pageIndex}>
              {page.result?.items.map((item: any, index: number) => (
                <Row
                  key={`${pageIndex}-${index}`}
                  rank={item.rank}
                  player={item.username}
                  collectedStar={item.total_count}
                />
              ))}
            </Fragment>
          ))}

          {hasNextPage && (
            <div ref={ref} className="flex items-center justify-center">
              {isFetchingNextPage ? (
                <Image
                  className="mt-4 jumpy"
                  src="/images/quests/carrot.png"
                  alt="loading"
                  width={32}
                  height={32}
                />
              ) : (
                <p className="text-white text-sm font-normal font-chakra">
                  Scroll down to load more
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
