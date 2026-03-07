"use client";

import { Suspense } from "react";
import { SectionConfirmPasswordWidget, View } from "../../components";

function ConfirmPasswordContent() {
  
  return (
    <View className="bg-img-banner bg-black bg-no-repeat bg-top min-h-screen flex flex-col justify-between">
      <View className="flex flex-col w-full">
        <View className="w-full flex flex-col justify-center items-center mb-10">
          <SectionConfirmPasswordWidget />
        </View>
      </View>
    </View>
  );
}

export default function ConfirmPassword() {
  return (
    <Suspense>
      <ConfirmPasswordContent />
    </Suspense>
  );
}
