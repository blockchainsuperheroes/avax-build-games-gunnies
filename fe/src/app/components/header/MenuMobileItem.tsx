import { Menu, Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export const MenuMobileItem = ({ data }: { data: any }) => {
  return (
    <>
      <div className="relative">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            {data.grouped ? (
              <Menu.Button className="inline-flex w-full items-center rounded-md px-4 py-2 uppercase  font-semibold text-[18px] leading-[26px] text-white">
                {({ open }) => (
                  <>
                    {data.title != `How to get started` ? (
                      <span className={`${open ? 'text-[#5E67FB]' : ''}`}>{data.title}</span>
                    ) : (
                      <div
                        className={`${open ? 'text-[#5E67FB]' : ''} flex items-center justify-center gap-2`}
                      >
                        <div className="bg-ic-speaker bg-center bg-cover bg-no-repeat w-[18px] h-5 lg:w-[22px] lg:h-[25px]" />
                        <div className="flex flex-col items-center">
                          <div>{data.title}</div>
                          <div className="font-sora text-[12px] leading-[15px] ">
                            - EARN PEN TOKEN -{' '}
                          </div>
                        </div>
                      </div>
                    )}
                    <ChevronDownIcon
                      fill={`${open ? '#5E67FB' : 'white'}`}
                      className="-mr-1 mt-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
                      aria-hidden="true"
                    />
                  </>
                )}
              </Menu.Button>
            ) : (
              <a
                href={data.route}
                className="inline-flex w-full items-center rounded-md px-4 py-2 uppercase  font-semibold text-[18px] leading-[26px] text-white"
              >
                {data.title != `IDO Links` ? (
                  <span
                    className={`${data.route ? 'hover:text-[#5E67FB]' : ''} flex items-center justify-center gap-2`}
                  >
                    {data.title}
                  </span>
                ) : (
                  <div
                    className={`${data.route ? 'hover:text-[#5E67FB]' : ''} flex items-center justify-center gap-2`}
                  >
                    <div className="bg-ic-bell bg-contain bg-no-repeat inline-flex w-[18px] h-5 lg:w-[22px] lg:h-6" />
                    <div>{data.title} </div>
                  </div>
                )}
              </a>
            )}
          </div>
          {data.grouped ? (
            <div>
              <Menu.Items className="px-4 w-full">
                {data.subGroup.map((it: any, index: number) => {
                  return (
                    <Menu.Item key={`menu-mobile-item-${index}`}>
                      {({ active }) => (
                        <a
                          href={it.route}
                          className={`${active ? 'text-[#5E67FB]' : 'text-white'} group border-none flex w-full items-center font-sora text-[18px] leading-[26px]`}
                        >
                          {`• ${it.title}`}
                        </a>
                      )}
                    </Menu.Item>
                  );
                })}
              </Menu.Items>
            </div>
          ) : null}
        </Menu>
      </div>
    </>
  );
};
