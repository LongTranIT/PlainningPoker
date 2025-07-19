import { create } from "zustand";

interface Vote {
  point: number | string;
  avatar: string;
}

interface PokerState {
  roomId: string;
  user: string;
  avatar: string;
  isAdmin: boolean;
  votes: Record<string, Vote>;
  revealed: boolean;

  setRoomId: (id: string) => void;
  setUser: (user: string) => void;
  setAvatar: (avatar: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setVotes: (votes: Record<string, Vote>) => void;
  setRevealed: (revealed: boolean) => void;
}

export const usePokerStore = create<PokerState>((set) => ({
  roomId: "",
  user: "",
  avatar: "",
  isAdmin: false,
  votes: {},
  revealed: false,

  setRoomId: (id) => set({ roomId: id }),
  setUser: (user) => set({ user }),
  setAvatar: (avatar) => set({ avatar }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setVotes: (votes) => set({ votes }),
  setRevealed: (revealed) => set({ revealed }),
}));
