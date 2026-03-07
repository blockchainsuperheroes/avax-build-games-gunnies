import Image from 'next/image';
import SectionBundlerLand from '../Sections/SectionBundlerLand';
import SectionIntro from '../Sections/SectionIntro';
import SectionPlayStyles from '../Sections/SectionPlayStyles';
import SectionHorde from '../Sections/SectionHorde';
import SectionSkills from '../Sections/SectionSkills';
import SectionSteam from '../Sections/SectionSteam';
import SectionEarlyAccess from '../Sections/SectionEarlyAccess';
import { Footer } from '@components/footer/Footer';
import SectionSystemRequirements from './SectionSystemRequirements';
import SectionInGameControls from './SectionInGameControls';

export default function SectionTop() {
  return (
    <section className="relative  xl:mx-auto md:-mt-20">
      <div
        id="section-top"
        className=" bg-[url('/images/nonatron.png')] 
  bg-no-repeat 
  bg-contain
    [background-position:10%_20%]
  lg:[background-position:10%_70%]"
      >
        <SectionBundlerLand />
        <SectionIntro />

        <SectionPlayStyles />
      </div>
      <div
        style={{
          backgroundImage: "url('/images/Burning-town.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0% -0%',
          backgroundSize: 'contain',
        }}
      >
        <SectionHorde />
        <SectionSkills />
      </div>

      <SectionSystemRequirements />
      <SectionInGameControls />

      {/* <SectionSteam /> */}
      <div className="mt-10 lg:mt-64">
        <SectionEarlyAccess />
      </div>
      <Footer />
    </section>
  );
}
