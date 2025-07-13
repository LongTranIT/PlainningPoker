"use client";
import { Button } from "@/components/ui/button";
import {
  useSessionStore,
  SessionState,
  Participant,
} from "@/store/sessionStore";

export default function Lobby({ onStart }: { onStart: () => void }) {
  const session = useSessionStore((s: SessionState) => s.session);
  const user = useSessionStore((s: SessionState) => s.user);
  const updateSession = useSessionStore((s: SessionState) => s.updateSession);

  if (!session) return null;
  const isHost = session.participants.find(
    (p: Participant) => p.id === user?.id
  )?.isHost;

  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-[40vh]">
      <h2 className="text-xl font-semibold">
        Session Code:{" "}
        <span className="font-mono bg-black/5 dark:bg-white/10 px-2 py-1 rounded">
          {session.code}
        </span>
      </h2>
      <div className="flex flex-col gap-2 items-center">
        <div className="font-medium mb-1">Participants:</div>
        <ul className="flex flex-col gap-1">
          {session.participants.map((p: Participant) => (
            <li
              key={p.id}
              className="px-3 py-1 rounded bg-muted/50 flex items-center gap-2"
            >
              <span>{p.name}</span>
              {p.isHost && <span className="text-xs text-primary">(Host)</span>}
              {p.id === user?.id && (
                <span className="text-xs text-accent">(You)</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      {isHost && (
        <Button
          className="w-64 mt-4"
          onClick={() => {
            updateSession({ roundActive: true });
            onStart();
          }}
        >
          Start Voting Round
        </Button>
      )}
    </div>
  );
}
