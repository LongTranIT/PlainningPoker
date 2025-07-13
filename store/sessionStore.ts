import { create } from "zustand";

export type Participant = {
  id: string;
  name: string;
  isHost?: boolean;
  vote?: number | null;
};

export type Session = {
  code: string;
  participants: Participant[];
  votesRevealed: boolean;
  roundActive: boolean;
  timer?: number;
  chat?: { user: string; message: string; time: string }[];
};

export interface SessionState {
  user: Participant | null;
  session: Session | null;
  setUser: (user: Participant) => void;
  setSession: (session: Session) => void;
  updateSession: (data: Partial<Session>) => void;
  resetVotes: () => void;
  setVote: (vote: number) => void;
  revealVotes: () => void;
  addMessage: (msg: { user: string; message: string }) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  session: null,
  setUser: (user: Participant) => set({ user }),
  setSession: (session: Session) => set({ session }),
  updateSession: (data: Partial<Session>) =>
    set((state: SessionState) => ({
      session: { ...state.session, ...data } as Session,
    })),
  resetVotes: () =>
    set((state: SessionState) => ({
      session: state.session
        ? {
            ...state.session,
            participants: state.session.participants.map((p: Participant) => ({
              ...p,
              vote: null,
            })),
            votesRevealed: false,
            roundActive: true,
          }
        : null,
    })),
  setVote: (vote: number) =>
    set((state: SessionState) => ({
      session:
        state.session && state.user
          ? {
              ...state.session,
              participants: state.session.participants.map((p: Participant) =>
                p.id === state.user!.id ? { ...p, vote } : p
              ),
            }
          : state.session,
    })),
  revealVotes: () =>
    set((state: SessionState) => ({
      session: state.session
        ? { ...state.session, votesRevealed: true, roundActive: false }
        : null,
    })),
  addMessage: (msg: { user: string; message: string }) =>
    set((state: SessionState) => ({
      session: state.session
        ? {
            ...state.session,
            chat: [
              ...(state.session.chat || []),
              { ...msg, time: new Date().toISOString() },
            ],
          }
        : null,
    })),
}));
