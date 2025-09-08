import { db } from "@/lib/firebase";
import { Player, Room } from "@/model/room";
import { ref, onValue, off } from "firebase/database";
import { create } from "zustand";

interface RoomState {
  room: Room | null;
  setRoom: (room: Room | null) => void;
  getPlayer: (userId: string) => Player | null;
  getIsRevealed: () => boolean;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  room: null,
  setRoom: (room) => set({ room }),
  getPlayer: (userId: string) => {
    const player = get().room?.players[userId];
    return player ? { ...player } : null;
  },
  getIsRevealed: () => {
    return get().room?.isRevealed ?? false;
  },
}));

// Listens for real-time updates to a specific room in Firebase Realtime Database
export const listenRoom = (roomId: string) => {
  const roomRef = ref(db, `rooms/${roomId}`);

  onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      useRoomStore.getState().setRoom(data);
    } else {
      useRoomStore.getState().setRoom(null);
    }
  });

  return () => off(roomRef);
};
