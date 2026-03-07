'use client';

import Image from 'next/image';
import React, { useRef, useEffect, useState } from 'react';

function SectionSystemRequirements() {
  const systemRequirements = [
    { label: 'OS', min: '64-bit Windows 10', rec: '64-bit Windows 10' },
    {
      label: 'Processor',
      min: 'AMD FX 4350 / Intel Avalanche i3 6300',
      rec: '🏆 Ryzen 5 or equivalent',
      bold: true,
    },
    { label: 'Memory', min: '6 GB RAM', rec: '🏆 8 GB RAM', bold: true },
    {
      label: 'Graphics',
      min: 'AMD Radeon™ HD 7730 / NVIDIA GeForce® GT 640',
      rec: '🏆 AMD Radeon™ R9 290 / NVIDIA GeForce® GTX 970',
      bold: true,
    },
    { label: 'DirectX', min: 'Version 11', rec: 'Version 11' },
    { label: 'Internet', min: 'Broadband required', rec: 'Broadband required' },
    { label: 'Storage', min: '3 GB available', rec: '3 GB available' },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowShadow(el.scrollLeft > 0);
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="mt-8 lg:mt-[152px] relative px-6">
      <Image
        src="/images/air-drop.png"
        alt="spaceship"
        width={490}
        height={71}
        className="hidden xl:block absolute align-middle -top-[12.2rem] right-16 z-0"
      />

      <p className="text-2xl lg:text-[58px] font-chakra text-[#1CBBBB] uppercase text-center font-bold relative">
        System Requirements
      </p>

      <div
        className="w-full max-w-[1132px] mx-auto mt-6 overflow-x-auto rounded-xl relative table-container"
        ref={scrollRef}
      >
        <div
          className="inline-block min-w-[700px] rounded-xl p-[2px]"
          style={{
            background:
              'linear-gradient(90deg, #8FFFFF -0.13%, #86DEFE 4.89%, #7BB5FC 10.9%, #7394FB 17.92%, #6C7AFA 24.94%, #6767FA 31.95%, #645CFA 39.97%, #6459FA 47.99%, #340058 100.13%)',
          }}
        >
          <div className="rounded-xl bg-white p-[1px]">
            <table className="w-full text-sm md:text-base font-sora bg-[#05101D] rounded-xl text-white table-fixed border-collapse">
              <thead>
                <tr className="border-b border-[#F0F0F0]">
                  <th className="bg-[#CCCECF] text-left font-bold sticky left-0 z-10 rounded-tl-xl p-4 w-[131px]">
                    <div className={`sticky-column-mask ${showShadow ? 'show' : ''}`}></div>
                  </th>
                  <th className="bg-[#bfecec] text-black font-semibold p-4">Minimum</th>
                  <th className="bg-[#1ebbbb] text-[#000000E0] font-semibold p-4 rounded-tr-xl">
                    🔥🔥🔥 Recommended
                  </th>
                </tr>
              </thead>
              <tbody>
                {systemRequirements.map(({ label, min, rec, bold }, index) => {
                  const isLast = index === systemRequirements.length - 1;
                  return (
                    <tr key={label} className="border-b border-[#F0F0F0] last:border-none">
                      <td
                        className={`bg-[#CCCECF] text-[#000000E0] font-chakra font-bold p-4 sticky left-0 z-10 w-[131px] ${
                          isLast ? 'rounded-bl-xl' : ''
                        }`}
                      >
                        {label}
                        {/* Mask overlay for each sticky cell */}
                        <div className={`sticky-column-mask ${showShadow ? 'show' : ''}`}></div>
                      </td>
                      <td className="bg-[#bfecec] text-black p-4">{min}</td>
                      <td
                        className={`bg-[#1ebbbb] text-[#000000E0] p-4 ${bold ? 'font-bold' : ''} ${
                          isLast ? 'rounded-br-xl' : ''
                        }`}
                      >
                        {rec}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .table-container {
          position: relative;
        }

        .sticky-column-mask {
          position: absolute;
          top: 0;
          right: -32px; /* Position it just outside the sticky column */
          height: 100%;
          width: 32px;
          background: linear-gradient(to right, rgba(0, 0, 0, 0.4), transparent);
          pointer-events: none;
          z-index: 15;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .sticky-column-mask.show {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

export default SectionSystemRequirements;
