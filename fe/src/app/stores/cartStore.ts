import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  quantity: number;
  priceId?: string;
  productId?: string;
}

export interface CartHistory {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
}

interface CartStore {
  items: CartItem[];
  history: CartHistory[];
  isCartModalOpen: boolean;
  selectedItem: CartItem | null;

  // Actions
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;

  // Modal actions
  openCartModal: (item: CartItem) => void;
  closeCartModal: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      history: [],
      isCartModalOpen: false,
      selectedItem: null,

      addToCart: newItem => {
        set(state => {
          const existingItem = state.items.find(item => item.id === newItem.id);

          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          } else {
            return {
              items: [...state.items, { ...newItem, quantity: 1 }],
            };
          }
        });
      },

      removeFromCart: id => {
        set(state => ({
          items: state.items.filter(item => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }

        set(state => ({
          items: state.items.map(item => (item.id === id ? { ...item, quantity } : item)),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      openCartModal: item => {
        set({ isCartModalOpen: true, selectedItem: item });
      },

      closeCartModal: () => {
        set({ isCartModalOpen: false, selectedItem: null });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
