import { UserInfo } from "@/model/user";
import { auth, loginAnonymously } from "@/lib/firebase";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userInfo: UserInfo | null;
  hydrated: boolean;
  authReady: boolean;
  setUserInfo: (
    name: string,
    avatar: string,
    isObserver: boolean
  ) => Promise<UserInfo>;
  clearUserInfo: () => void;
  setHydrated: (hydrated: boolean) => void;
  ensureAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      hydrated: false,
      authReady: false,
      setUserInfo: async (
        name: string,
        avatar: string,
        isObserver: boolean
      ) => {
        await get().ensureAuth(); // Ensure user is authenticated
        const userInfo = {
          id: auth.currentUser?.uid || "", // Use Firebase auth UID
          name,
          avatar,
          isObserver,
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
      ensureAuth: async () => {
        // If we already have a Firebase user, no need to login again
        if (auth.currentUser) return;

        try {
          await loginAnonymously();
        } catch (error) {
          console.error("Authentication failed:", error);
          throw error;
        }
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
