'use client';

import Image from 'next/image';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { View, ButtonIcon } from '@/app/components/common';
import LoadingScreen from '../components/common/LoadingScreen';

function ValidateEmailContent() {
  const params = useSearchParams();
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    if (params?.get('key')) {
      (async () => {
        try {
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${params.get(`key`)}`,
            },
          };

          const result = await fetch(
            `/api/${process.env.NEXT_PUBLIC_PROXY_PATH}/user/validate-email`,
            options
          );
          const json = await result.json();

          if (json.status) {
            toast.success(`Email address validated!`);
            setKey(params.get('key'));
          }
        } catch (e) {
          console.log('error');
          console.log(e);
        }
      })();
    }
  }, [params]);

  return (
    <View className="min-h-screen flex flex-col">
      <View className="flex flex-col mt-[50px] w-full">
        <View className="w-full flex justify-center ">
          {key ? (
            <div className="flex flex-col items-center justify-center gap-4 bg-[#00000099] p-8 rounded-2xl border border-white">
              <div className="relative h-[62px] w-[62px] md:h-[50px] md:w-[50px] lg:h-[79px] lg:w-[79px]">
                <Image
                  priority={true}
                  fill={true}
                  objectFit="contain"
                  src={`/assets/icons/ic-checked-circle-white.svg`}
                  alt=""
                />
              </div>

              <p className="font-batgrexo text-4xl text-center">
                Your email has been successfully validated
              </p>
              <p className="font-batgrexo text-4xl text-center">let the adventure begin!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 bg-[#00000099] p-8 rounded-2xl border border-white">
              <div className="relative  h-[48px] w-[120px] md:h-[36px] md:w-[90px] lg:h-[48px] lg:w-[120px]">
                <Image
                  priority={true}
                  fill={true}
                  objectFit="contain"
                  src={`/assets/icons/ic-email.svg`}
                  alt=""
                />
              </div>
              <p className="font-batgrexo text-[32px] leading-1 lg:text-[48px] w-full mt-[43px] lg:mt-[47px] uppercase text-center">
                thanks for registering
              </p>
              <p className="font-impact text-xl text-center">
                Please validate your email address to login. (check spam folder)
              </p>
            </div>
          )}
        </View>
      </View>
    </View>
  );
}

export default function ValidateEmail() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ValidateEmailContent />
    </Suspense>
  );
}
