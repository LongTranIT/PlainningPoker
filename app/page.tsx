"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarPicker } from "@/components/AvatarPicker";
import { useUserStore } from "@/store/userStore";
import { db, ref, set } from "@/lib/firebase";
import { generateId } from "@/lib/utils";
import { DEFAULT_CARD_SET, Player, Room } from "@/model/room";
import { useRoomStore } from "@/store/roomStore";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const { userInfo, setUserInfo } = useUserStore();
  const { setRoom } = useRoomStore();

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.name);
      setSelectedAvatar(userInfo.avatar);
    }
  }, [userInfo]);

  const handleJoin = async () => {
    try {
      if (!userName || !roomName || !selectedAvatar) {
        alert("Please enter your name, room ID, and select an avatar!");
        return;
      }

      setIsJoining(true);

      const finalUser =
        !userInfo ||
        userInfo.name !== userName ||
        userInfo.avatar !== selectedAvatar
          ? setUserInfo(userName, selectedAvatar)
          : userInfo;

      // Initialize room data
      const roomId = generateId();
      const roomRef = ref(db, `rooms/${roomId}`);
      const now = new Date().toISOString();

      const adminPlayer: Player = {
        id: finalUser.id,
        name: finalUser.name,
        avatar: finalUser.avatar,
        vote: null,
        isAdmin: true,
        isObserver: false,
        joinedAt: now,
      };

      const room: Room = {
        roomId: roomId,
        name: roomName,
        createdAt: now,
        players: {
          [adminPlayer.id]: adminPlayer,
        },
        createdBy: adminPlayer.id,
        isRevealed: false,
        cardSet: DEFAULT_CARD_SET,
      };

      await set(roomRef, room);
      setRoom(room);

      // Navigate to room
      await router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Failed to join room. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Scrum Planning Poker</h1>
      <Input
        placeholder="Your name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="w-64"
      />
      <Input
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="w-64"
      />

      <AvatarPicker selected={selectedAvatar} onSelect={setSelectedAvatar} />

      <Button
        className="w-64"
        onClick={handleJoin}
        disabled={!userName || !roomName || !selectedAvatar || isJoining}
      >
        {isJoining ? "Joining..." : "Join Room"}
      </Button>
    </main>
  );
}
