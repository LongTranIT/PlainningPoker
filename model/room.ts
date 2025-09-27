import { UserInfo } from "./user";

export interface Player extends UserInfo {
  vote: string | null;
  isAdmin: boolean;
  joinedAt: string;
  isOffline?: boolean;
}

export interface Room {
  roomId: string;
  name: string;
  createdBy: string;
  createdAt: string;
  isRevealed: boolean;
  cardSet: string[];
  players: Record<string, Player>;
}

export const DEFAULT_CARD_SET = [
  "0",
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "21",
  "☕",
];
