import { Footer } from '../footer/Footer';
import { SectionChapters } from './SectionChapters';
import { SectionCharacters } from './SectionCharacters';

export default function SectionLineupAndMore() {
  return (
    <section className="relative flex flex-col bg-black w-full h-fit">
      <div className="relative flex flex-col bg-black w-full h-fit  mb-[54px] lg:mb-[76px] bg-lineup-and-more-bg-md lg:bg-lineup-and-more-bg bg-no-repeat bg-top bg-contain">
        <SectionCharacters />
        <SectionChapters />
      </div>
      <Footer />
    </section>
  );
}
