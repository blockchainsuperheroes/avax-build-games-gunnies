"use client";

import { SignUpAndDiveIn, View } from "@/app/components";
import { Suspense } from "react";

function SignUpContent() {
  
  return (
    <View className="bg-img-banner bg-black bg-no-repeat bg-top min-h-screen flex flex-col justify-between">
      <View className="flex flex-col w-full">
        <View className="w-full flex flex-col justify-center items-center mb-10">
          <SignUpAndDiveIn />
        </View>
      </View>
    </View>
  );
}

export default function SignUp() {
  return (
    <Suspense>
      <SignUpContent />
    </Suspense>
  );
}
