import Image from 'next/image';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import useIsMounted from '../../../../hooks/useIsMounted';

export default function SectionBundlerLand() {
  const [playVideo, setPlayVideo] = useState(true);
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
    // or return a loading spinner, e.g. <p>Loading...</p>
  }

  const handlePlayClick = () => {
    setPlayVideo(true);

    // Scroll to the element with ID "bundler-land"
    const bundlerLandEl = document.getElementById('section-top');
    if (bundlerLandEl) {
      bundlerLandEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative  mt-6 lg:mt-52 mx-2">
      {!playVideo ? (
        /* Show the preview image (with play icon) */
        <div className="relative hover:opacity-90 cursor-pointer" onClick={handlePlayClick}>
          <Image
            src="/images/bundler-land.svg"
            alt="logo"
            width={1278}
            height={71}
            className="mx-auto"
          />
          <Image
            src="/images/play.png"
            alt="play icon"
            width={50}
            height={71}
            className="mx-auto absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      ) : (
        /* Show the video inline */
        <div className="max-w-[1200px] w-full mx-auto">
          <ReactPlayer
            className="react-player"
            playing={playVideo}
            url="assets/gunnies-trailer.mp4"
            width="100%"
            height="100%"
            controls={true}
            muted={true}
          />
        </div>
      )}
    </section>
  );
}
