"use client";

import { useEffect, useState } from "react";
import { db, ref, update, set, get } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { PokerCard } from "@/components/PokerCard";
import { PlayerList } from "@/components/PlayerList";
import { UserInfoDialog } from "@/components/UserInfoDialog";
import { listenRoom, useRoomStore } from "@/store/roomStore";
import { useUserStore } from "@/store/userStore";
import { Player } from "@/model/room";
import { toast } from "sonner";

interface PokerRoomProps {
  roomId: string;
}

export function PokerRoom({ roomId }: PokerRoomProps) {
  const { room, getIsRevealed, getPlayer } = useRoomStore();
  const { hydrated, userInfo, setUserInfo } = useUserStore();
  const [userDialogVisibility, setUserDialogVisibility] = useState(false);

  const isRevealed = getIsRevealed();
  const userPlayer = getPlayer(userInfo?.id || "");

  useEffect(() => {
    const unsubscribe = listenRoom(roomId);
    return () => unsubscribe(); // cleanup
  }, [roomId]);

  useEffect(() => {
    if (!hydrated) return; // Wait until the user store is hydrated
    if (!userInfo) {
      setUserDialogVisibility(true);
    } else {
      addPlayer(userInfo.id, userInfo.name, userInfo.avatar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, hydrated]);

  const vote = async (point: string) => {
    if (!userInfo || !room) {
      toast.error(
        `Cannot vote: ${
          !userInfo ? "User information" : "Room data"
        } is missing.`
      );
      return;
    }
    try {
      const playerRef = ref(db, `rooms/${roomId}/players/${userInfo.id}`);
      await update(playerRef, { vote: point });
    } catch (error) {
      toast.error("Failed to submit vote: " + error);
      throw error;
    }
  };

  const revealVotes = async () => {
    if (!userPlayer?.isAdmin) return;
    try {
      await update(ref(db, `rooms/${roomId}`), { isRevealed: true });
    } catch (error) {
      toast.error("Failed to reveal votes: " + error);
      throw error;
    }
  };

  const resetRound = async () => {
    try {
      const roomRef = ref(db, `rooms/${roomId}`);
      const snapshot = await get(ref(db, `rooms/${roomId}/players`));

      const updates: Record<string, boolean | null> = {
        isRevealed: false,
      };

      if (snapshot.exists()) {
        Object.keys(snapshot.val()).forEach((uid) => {
          updates[`players/${uid}/vote`] = null;
        });
      }

      await update(roomRef, updates);
    } catch (error) {
      toast.error("Failed to reset round: " + error);
      throw error;
    }
  };

  const addPlayer = async (playerId: string, name: string, avatar: string) => {
    try {
      const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
      const snapshot = await get(playerRef);

      if (snapshot.exists()) {
        return; // Player already exists
      }
      const now = new Date().toISOString();

      const player: Player = {
        id: playerId,
        name: name,
        avatar: avatar,
        vote: null,
        isAdmin: false,
        isObserver: false,
        joinedAt: now,
      };
      await set(playerRef, player);
    } catch (error) {
      toast.error("Failed to add player: " + error);
      throw error;
    }
  };

  return (
    <>
      <UserInfoDialog
        open={userDialogVisibility}
        onSave={(name: string, avatar: string) => {
          const userInfo = setUserInfo(name, avatar);
          addPlayer(userInfo.id, name, avatar);
          setUserDialogVisibility(false);
        }}
      />

      <div className="p-8">
        <h2 className="text-2xl mb-4">{room?.name || `Room: ${roomId}`}</h2>

        <PlayerList
          players={room?.players || {}}
          isRevealed={room?.isRevealed || false}
        />

        <div className="grid grid-cols-4 gap-4 mt-8">
          {room?.cardSet.map((p) => (
            <PokerCard
              key={p}
              point={p}
              selected={userPlayer?.vote === p}
              onClick={() => {
                vote(p);
              }}
              disabled={isRevealed}
            />
          ))}
        </div>

        {userPlayer?.isAdmin && (
          <div className="mt-8 space-x-4">
            <Button onClick={revealVotes} disabled={isRevealed}>
              Reveal Votes
            </Button>
            <Button
              onClick={resetRound}
              disabled={!isRevealed}
              variant="outline"
            >
              Reset Round
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
