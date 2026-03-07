"use client";

import { SectionForgotPasswordWidget, View } from "@/app/components";
import { Suspense } from "react";

function ForgotPasswordContent() {
  
  return (
    <View className="bg-img-banner bg-black bg-no-repeat bg-top min-h-screen flex flex-col justify-between">
      <View className="flex flex-col w-full">
        <View className="w-full flex flex-col justify-center items-center">
          <SectionForgotPasswordWidget />
        </View>
      </View>
    </View>
  );
}

export default function ForgotPassword() {
  return (
    <Suspense>
      <ForgotPasswordContent />
    </Suspense>
  );
}
