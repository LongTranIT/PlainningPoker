"use client";

import { useEffect, useState } from "react";
import { db, ref, onValue, update } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { PokerCard } from "@/components/PokerCard";
import { PlayerList } from "@/components/PlayerList";
import { usePokerStore } from "@/store/usePokerStore";

interface PokerRoomProps {
  params: {
    roomId: string;
  };
}

interface PokerRoomData {
  revealed: boolean;
  votes: Record<string, number | string | null>;
}

const points = [1, 2, 3, 5, 8, 13, 21, "?"];

export default function PokerRoom({ params }: PokerRoomProps) {
  const roomId = params.roomId;
  const { user, setRoomId, votes, setVotes, revealed, setRevealed } =
    usePokerStore();
  const [selected, setSelected] = useState<number | string | null>(null);

  useEffect(() => {
    setRoomId(roomId);
    const roomRef = ref(db, `rooms/${roomId}`);

    onValue(roomRef, (snapshot) => {
      const data = snapshot.val() as PokerRoomData;
      if (data) {
        setVotes(data.votes || {});
        setRevealed(data.revealed || false);
      }
    });
  }, [roomId]);

  const vote = (point: number | string) => {
    setSelected(point);
    update(ref(db, `rooms/${roomId}/votes`), { [user]: point });
  };

  const reveal = () => update(ref(db, `rooms/${roomId}`), { revealed: true });

  const reset = () => {
    update(ref(db, `rooms/${roomId}`), { revealed: false, votes: {} });
    setSelected(null);
  };

  return (
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
  );
}
