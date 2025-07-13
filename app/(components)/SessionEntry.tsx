"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSessionStore, SessionState } from "@/store/sessionStore";

export default function SessionEntry({
  onEnterSession,
}: {
  onEnterSession: () => void;
}) {
  const [mode, setMode] = useState<"create" | "join" | null>(null);
  const [code, setCode] = useState("");
  const user = useSessionStore((s: SessionState) => s.user);
  const setSession = useSessionStore((s: SessionState) => s.setSession);

  function handleCreate() {
    const sessionCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    setSession({
      code: sessionCode,
      participants: [
        {
          id: user?.id ?? "",
          name: user?.name ?? "",
          vote: user?.vote ?? null,
          isHost: true,
        },
      ],
      votesRevealed: false,
      roundActive: false,
      chat: [],
    });
    onEnterSession();
  }

  function handleJoin() {
    if (!code.trim()) return;
    if (!user) return;
    setSession({
      code: code.trim().toUpperCase(),
      participants: [user],
      votesRevealed: false,
      roundActive: false,
      chat: [],
    });
    onEnterSession();
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[40vh]">
      <div className="flex gap-4">
        <Button
          variant={mode === "create" ? "default" : "outline"}
          onClick={() => setMode("create")}
        >
          Create Session
        </Button>
        <Button
          variant={mode === "join" ? "default" : "outline"}
          onClick={() => setMode("join")}
        >
          Join Session
        </Button>
      </div>
      {mode === "create" && (
        <Button className="w-64 mt-4" onClick={handleCreate}>
          Start New Session
        </Button>
      )}
      {mode === "join" && (
        <div className="flex flex-col gap-2 mt-4 w-64">
          <input
            className="border rounded px-3 py-2"
            placeholder="Enter session code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            autoFocus
          />
          <Button onClick={handleJoin} disabled={!code.trim()}>
            Join
          </Button>
        </div>
      )}
    </div>
  );
}
