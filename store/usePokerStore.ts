import { create } from "zustand";

interface PokerState {
  roomId: string;
  user: string;
  votes: Record<string, number | string | null>;
  revealed: boolean;

  setRoomId: (id: string) => void;
  setUser: (user: string) => void;
  setVotes: (votes: Record<string, number | string | null>) => void;
  setRevealed: (revealed: boolean) => void;
}

export const usePokerStore = create<PokerState>((set) => ({
  roomId: "",
  user: "",
  votes: {},
  revealed: false,

  setRoomId: (id) => set({ roomId: id }),
  setUser: (user) => set({ user }),
  setVotes: (votes) => set({ votes }),
  setRevealed: (revealed) => set({ revealed }),
}));
