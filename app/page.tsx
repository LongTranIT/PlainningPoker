"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePokerStore } from "@/store/usePokerStore";
import { AvatarPicker } from "@/components/AvatarPicker";
import { loadUserInfo, saveUserInfo } from "@/lib/localStorage";

export default function Home() {
  const router = useRouter();
  const { setRoomId, setUser, setAvatar } = usePokerStore();
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");

  useEffect(() => {
    const savedUser = loadUserInfo();
    if (savedUser) {
      setName(savedUser.name);
      setSelectedAvatar(savedUser.avatar);
    }
  }, []);

  const handleJoin = async () => {
    try {
      if (!name || !room || !selectedAvatar) {
        alert("Please enter your name, room ID, and select an avatar!");
        return;
      }

      // Save user info first
      await saveUserInfo(name, selectedAvatar);

      // Update store
      setRoomId(room);
      setUser(name);
      setAvatar(selectedAvatar);

      // Navigate to room
      await router.push(`/room/${room}`);
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Failed to join room. Please try again.");
    }
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

      <AvatarPicker selected={selectedAvatar} onSelect={setSelectedAvatar} />

      <Button
        className="w-64"
        onClick={handleJoin}
        disabled={!name || !room || !selectedAvatar}
      >
        Join Room
      </Button>
    </main>
  );
}
