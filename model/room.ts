export interface Player {
  id: string;
  name: string;
  avatar: string;
  vote: string | null;
  isObserver: boolean;
  isAdmin: boolean;
  joinedAt: string;
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

export const DEFAULT_CARD_SET = ["1", "2", "3", "5", "8", "13", "?"];
