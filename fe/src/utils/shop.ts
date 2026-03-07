import { ShopItem } from "@/app/types/shop";

export const getProductInfo = (shopItems: ShopItem[], stripeProductId: string) => {
  return shopItems.find(item => item.id === stripeProductId);
};
