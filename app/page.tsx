"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePokerStore } from "@/store/usePokerStore";

export default function Home() {
  const router = useRouter();
  const { setRoomId, setUser } = usePokerStore();
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");

  const handleJoin = () => {
    if (!name || !room) {
      alert("Please enter your name and room ID!");
      return;
    }

    setRoomId(room);
    setUser(name);
    router.push(`/room/${room}`);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Scrum Planning Poker</h1>
      <Input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-64"
      />
      <Input
        placeholder="Room ID"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="w-64"
      />
      <Button className="w-64" onClick={handleJoin}>
        Join Room
      </Button>
    </main>
  );
}
