export type OrderStatus = 'Success' | 'Processing' | 'Fail';

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  priceId: string;
  productId: string;
}