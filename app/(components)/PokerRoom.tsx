"use client";
import { Button } from "@/components/ui/button";
import {
  useSessionStore,
  SessionState,
  Participant,
} from "@/store/sessionStore";

const ESTIMATES = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, "?", "☕"];

export default function PokerRoom({
  onBackToLobby,
}: {
  onBackToLobby: () => void;
}) {
  const session = useSessionStore((s: SessionState) => s.session);
  const user = useSessionStore((s: SessionState) => s.user);
  const setVote = useSessionStore((s: SessionState) => s.setVote);
  const revealVotes = useSessionStore((s: SessionState) => s.revealVotes);
  const resetVotes = useSessionStore((s: SessionState) => s.resetVotes);

  if (!session || !user) return null;
  const isHost = session.participants.find(
    (p: Participant) => p.id === user.id
  )?.isHost;
  const allVoted = session.participants.every(
    (p: Participant) => p.vote !== null && p.vote !== undefined
  );

  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-[40vh] w-full">
      <div className="flex flex-col gap-2 items-center">
        <div className="font-medium mb-1">Participants:</div>
        <ul className="flex flex-wrap gap-2 justify-center">
          {session.participants.map((p: Participant) => (
            <li
              key={p.id}
              className="px-3 py-1 rounded bg-muted/50 flex items-center gap-2"
            >
              <span>{p.name}</span>
              {p.isHost && <span className="text-xs text-primary">(Host)</span>}
              {p.id === user.id && (
                <span className="text-xs text-accent">(You)</span>
              )}
              <span className="ml-2">
                {session.votesRevealed ? (
                  p.vote !== null && p.vote !== undefined ? (
                    <span className="font-bold">{p.vote}</span>
                  ) : (
                    <span className="text-muted-foreground">No vote</span>
                  )
                ) : p.vote !== null && p.vote !== undefined ? (
                  <span className="text-muted-foreground">Voted</span>
                ) : (
                  <span className="text-muted-foreground">...</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {ESTIMATES.map((val, i) => (
          <Button
            key={i}
            variant={user.vote === val ? "default" : "outline"}
            className="w-16 h-24 text-2xl font-mono flex flex-col items-center justify-center"
            onClick={() => setVote(val as number)}
            disabled={session.votesRevealed || user.vote === val}
          >
            {val}
          </Button>
        ))}
      </div>
      <div className="flex gap-4 mt-6">
        {isHost && !session.votesRevealed && (
          <Button onClick={revealVotes} disabled={!allVoted}>
            Reveal Votes
          </Button>
        )}
        {session.votesRevealed && <Button onClick={resetVotes}>Reset</Button>}
        <Button variant="outline" onClick={onBackToLobby}>
          Back to Lobby
        </Button>
      </div>
    </div>
  );
}
