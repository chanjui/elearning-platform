import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const noOpStorage: Storage = {
    getItem() { return null },
    setItem() {},
    removeItem() {},
    clear() {},
    key() { return null },
    length: 0,
  };
  

interface CartItem {
  courseId: number;
  title: string;
  instructor: string;
  price: number;
  discountedPrice: number;
  discountAmount: number;
  discountRate: number;
  image: string;
}

interface CartStore {
  cartItems: CartItem[];
  selectedItems: number[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (courseId: number) => void;
  selectItem: (courseId: number) => void;
  deselectItem: (courseId: number) => void;
  clearCart: () => void;
  setCartItems: (items: CartItem[]) => void;
  loadSelectedItems: () => void;
  saveSelectedItems: () => void;
  toggleAll: (allIds: number[]) => void;
  clearSelectedItems: () => void;
}

export const cartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      selectedItems: [],
      addToCart: (item) => set((state) => ({
        cartItems: [...state.cartItems, item]
      })),
      removeFromCart: (courseId) => set((state) => ({
        cartItems: state.cartItems.filter(item => item.courseId !== courseId)
      })),
      selectItem: (courseId) => set((state) => {
        const updatedSelectedItems = state.selectedItems.includes(courseId)
          ? state.selectedItems
          : [...state.selectedItems, courseId];
        return { selectedItems: updatedSelectedItems };
      }),
      deselectItem: (courseId) => set((state) => {
        const updatedSelectedItems = state.selectedItems.filter(id => id !== courseId);
        return { selectedItems: updatedSelectedItems };
      }),
      clearCart: () => set({ cartItems: [], selectedItems: [] }),
      setCartItems: (items) => set({ cartItems: items }),
      loadSelectedItems: () => set({
        selectedItems: JSON.parse(localStorage.getItem("selectedItems") || "[]")
      }),
      saveSelectedItems: () => localStorage.setItem("selectedItems", JSON.stringify(get().selectedItems)),
      toggleAll: (allIds: number[]) => set((state) => ({
        selectedItems: state.selectedItems.length === allIds.length ? [] : allIds
      })),
      clearSelectedItems: () => set({ selectedItems: [] })
    }),
    {
        name: "cart-storage",
        // 클라이언트에서는 localStorage, SSR에서는 noOpStorage 사용
        storage: createJSONStorage(() => 
          typeof window !== "undefined" ? window.localStorage : noOpStorage
        ),
    }
  )
);