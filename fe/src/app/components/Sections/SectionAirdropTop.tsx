import Image from 'next/image';
// import EarlyAccessButton from "../EarlyAccessButton";

export default function SectionAirDropTop() {
  return (
    <section className="relative bg-black pb-4 lg:pb-20 xl:pb-0">
      <section className="relative w-full">
        <Image
          src="/images/banner-airdrop.png"
          alt="logo"
          width={1906}
          height={71}
          className="block mx-auto"
        />

        <Image
          src="/images/gunnies-logo-hz.svg"
          alt="logo"
          width={400}
          height={71}
          className="
        w-[196px]
        lg:w-[375px]
        absolute
        top-[5%] lg:top-[10%]
        left-1/2
        -translate-x-1/2
        lg:max-w-[854px]
      "
        />

        <div className="    ">
          <a
            href="https://avalanche.games"
            target="_new"
            className="w-full grid  justify-items-end	mt-10 lg:mt-0 pointer"
          >
            <Image
              src="/images/pgxp-logo-wide.svg"
              alt="logo"
              width={260}
              height={71}
              className="mx-auto mt-3 w-[160px] lg:w-[244px] mt-16"
            />
          </a>
        </div>
      </section>
    </section>
  );
}
