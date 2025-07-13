"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSessionStore, SessionState } from "@/store/sessionStore";

export default function Loggin({ onLogin }: { onLogin: () => void }) {
  const [name, setName] = useState("");
  const setUser = useSessionStore((s: SessionState) => s.setUser);

  function handleLogin() {
    if (!name.trim()) return;
    setUser({ id: crypto.randomUUID(), name });
    onLogin();
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-2">Planning Poker</h1>
      <input
        className="border rounded px-3 py-2 w-64"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        autoFocus
      />
      <Button className="w-64" onClick={handleLogin} disabled={!name.trim()}>
        Continue
      </Button>
    </div>
  );
}
