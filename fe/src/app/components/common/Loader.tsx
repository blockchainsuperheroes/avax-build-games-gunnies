import { View } from "./View";

export const Loader = ({ className }: { className?: string }) => {
  return (
    <View className={`${className} py-32`}>
      <img className={`w-20 mx-auto`} src="/assets/icons/loader.svg" alt="" />
    </View>
  );
};
