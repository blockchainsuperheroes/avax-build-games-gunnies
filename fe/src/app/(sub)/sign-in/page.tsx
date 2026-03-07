"use client";

import { SectionSignInWidget, View } from "@/app/components";
import { Suspense } from "react";


function SignInContent() {
  
  return (
    <View className="bg-img-banner bg-black bg-no-repeat bg-top min-h-screen flex flex-col justify-between">
      <View className="flex flex-col w-full">
        <View className="w-full flex flex-col justify-center items-center mb-10">
          <SectionSignInWidget />
        </View>
      </View>
    </View>
  );
}

export default function SignUp() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
