import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const generateUUIDv4 = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random: number = Math.floor(Math.random() * 16); // 0–15
    const value: number = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

export const generateId = () => {
  return generateUUIDv4();
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
