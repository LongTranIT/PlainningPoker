import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const generateId = () => {
  return crypto.randomUUID();
};

export const dbPaths = {
  room: (roomId: string) => `rooms/${roomId}`,
  players: (roomId: string) => `rooms/${roomId}/players`,
  player: (roomId: string, playerId: string) =>
    `rooms/${roomId}/players/${playerId}`,
  vote: (playerId: string) => `players/${playerId}/vote`,
};

export const nameOfFactory = <T>() => {
  return <K extends keyof T>(key: K) => key;
};
