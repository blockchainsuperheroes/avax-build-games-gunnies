import { Menu, Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export const MenuItem = ({ data, isEnd }: { data: any; isEnd: boolean }) => {
  const router = useRouter();

  return (
    <>
      <div className="relative flex items-center">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            {
              <a
                href={data.route}
                className="inline-flex w-full justify-center items-center rounded-md   py-2   font-sora font-light text-[16px] xl:text-[20px]  text-white"
              >
                {
                  <div
                    className={`${data.route ? 'hover:text-main-green' : ''} flex items-center justify-center gap-2`}
                  >
                    <div className="bg-ic-bell bg-contain bg-no-repeat inline-flex w-[18px] h-5 lg:w-[22px] lg:h-6" />
                    <div>{data.title} </div>
                  </div>
                }
              </a>
            }
          </div>
          {data.grouped ? (
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute px-4 py-2.5 z-20 right-0 mt-1 w-[240px] origin-top-right rounded-md bg-[#222222] shadow-lg">
                {data.subGroup.map((it: any, index: number) => {
                  return (
                    <Menu.Item key={`menu-item-${index}`}>
                      {({ active }) =>
                        it.available ? (
                          <a
                            href={it.route}
                            className={`${active ? 'text-[#5E67FB]' : 'text-white'} group border-none flex w-full items-center font-sora text-14 leading-26`}
                          >
                            {`${it.title}`}
                          </a>
                        ) : (
                          <span className="text-white border-none flex w-full items-center font-sora text-14 leading-26">
                            {it.title}
                          </span>
                        )
                      }
                    </Menu.Item>
                  );
                })}
              </Menu.Items>
            </Transition>
          ) : null}
        </Menu>
      </div>
      {!isEnd ? (
        <div className=" flex flex-row justify-center items-center text-white">
          <span className="">{}</span>
        </div>
      ) : null}
    </>
  );
};
