"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useSessionStore, SessionState } from "@/store/sessionStore";
const Login = dynamic<{ onLogin: () => void }>(
  () => import("./(components)/Login"),
  { ssr: false }
);
const SessionEntry = dynamic<{ onEnterSession: () => void }>(
  () => import("./(components)/SessionEntry"),
  { ssr: false }
);
const Lobby = dynamic<{ onStart: () => void }>(
  () => import("./(components)/Lobby"),
  { ssr: false }
);
const PokerRoom = dynamic<{ onBackToLobby: () => void }>(
  () => import("./(components)/PokerRoom"),
  { ssr: false }
);

export default function Home() {
  const user = useSessionStore((s: SessionState) => s.user);
  const session = useSessionStore((s: SessionState) => s.session);
  const [stage, setStage] = useState<"login" | "entry" | "lobby" | "poker">(
    "login"
  );

  // Progression logic
  if (!user) {
    if (stage !== "login") setStage("login");
    return <Login onLogin={() => setStage("entry")} />;
  }
  if (!session) {
    if (stage !== "entry") setStage("entry");
    return <SessionEntry onEnterSession={() => setStage("lobby")} />;
  }
  if (session && !session.roundActive) {
    if (stage !== "lobby") setStage("lobby");
    return <Lobby onStart={() => setStage("poker")} />;
  }
  if (session && session.roundActive) {
    if (stage !== "poker") setStage("poker");
    return <PokerRoom onBackToLobby={() => setStage("lobby")} />;
  }
  return null;
}
