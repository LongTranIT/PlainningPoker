import { generateId } from "@/lib/utils";
import { UserInfo } from "@/model/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userInfo: UserInfo | null;
  hydrated: boolean;
  setUserInfo: (name: string, avatar: string) => UserInfo;
  clearUserInfo: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      hydrated: false, // Indicates if the store has been rehydrated
      setUserInfo: (name: string, avatar: string) => {
        const userInfo = {
          id: get().userInfo?.id || generateId(),
          name,
          avatar,
        };
        set({ userInfo });
        return userInfo;
      },
      clearUserInfo: () => {
        set({ userInfo: null });
      },
      setHydrated: (hydrated: boolean) => {
        set({ hydrated });
      },
    }),
    {
      name: "poker_user", // LocalStorage key
      onRehydrateStorage: () => (state, error) => {
        if (!error) {
          state?.setHydrated(true);
        }
      },
    }
  )
);
