"use client";

import { useEffect, useState } from "react";
import { db, ref, onValue, update } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { PokerCard } from "@/components/PokerCard";
import { PlayerList } from "@/components/PlayerList";
import { usePokerStore } from "@/store/usePokerStore";
import { UserInfoDialog } from "@/components/UserInfoDialog";

interface PokerRoomProps {
  params: {
    roomId: string;
  };
}

interface PokerRoomData {
  revealed: boolean;
  votes: Record<string, { point: number | string; avatar: string }>;
}

const points = [1, 2, 3, 5, 8, 13, 21, "?"];

export default function PokerRoom({ params }: PokerRoomProps) {
  const roomId = params.roomId;
  const {
    user,
    avatar,
    setRoomId,
    setUser,
    setAvatar,
    votes,
    setVotes,
    revealed,
    setRevealed,
  } = usePokerStore();
  const [selected, setSelected] = useState<number | string | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);

  useEffect(() => {
    const initializeRoom = () => {
      setRoomId(roomId);
      const roomRef = ref(db, `rooms/${roomId}`);
      onValue(roomRef, (snapshot) => {
        const data = snapshot.val() as PokerRoomData;
        if (data) {
          setVotes(data.votes || {});
          setRevealed(data.revealed || false);
        }
      });
    };

    // Check if user info exists in local storage
    const savedUser = localStorage.getItem("poker_user");
    if (!savedUser) {
      setShowUserDialog(true);
      return;
    }

    // Parse user info and verify it exists in Firebase
    const userInfo = JSON.parse(savedUser);
    const userRef = ref(db, `users/${userInfo.name}`);

    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (!userData) {
        // If user doesn't exist in Firebase, show dialog
        setShowUserDialog(true);
        return;
      }

      // If user exists, set up user data and initialize room
      setUser(userInfo.name);
      setAvatar(userInfo.avatar);
      initializeRoom();
    });
  }, [roomId, setRoomId, setUser, setAvatar, setVotes, setRevealed]);

  const handleUserSave = (name: string, userAvatar: string) => {
    setUser(name);
    setAvatar(userAvatar);
    setShowUserDialog(false);

    // Set up room after user info is saved
    setRoomId(roomId);
    const roomRef = ref(db, `rooms/${roomId}`);
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val() as PokerRoomData;
      if (data) {
        setVotes(data.votes || {});
        setRevealed(data.revealed || false);
      }
    });
  };

  const vote = (point: number | string) => {
    setSelected(point);
    update(ref(db, `rooms/${roomId}/votes`), {
      [user]: { point, avatar: `${avatar}` },
    });
  };

  const reveal = () => update(ref(db, `rooms/${roomId}`), { revealed: true });

  const reset = () => {
    update(ref(db, `rooms/${roomId}`), { revealed: false, votes: {} });
    setSelected(null);
  };

  return (
    <>
      <UserInfoDialog open={showUserDialog} onSave={handleUserSave} />

      <div className="p-8">
        <h2 className="text-2xl mb-4">Room: {roomId}</h2>

        <PlayerList votes={votes} revealed={revealed} />

        <div className="grid grid-cols-4 gap-4 mt-8">
          {points.map((p) => (
            <PokerCard
              key={p}
              point={p}
              selected={selected === p}
              onClick={() => vote(p)}
            />
          ))}
        </div>

        <div className="mt-8 flex space-x-4">
          <Button onClick={reveal}>Reveal</Button>
          <Button onClick={reset} variant="destructive">
            Reset
          </Button>
        </div>
      </div>
    </>
  );
}
