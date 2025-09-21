"use client";

import { useEffect, useMemo, useState } from "react";
import { db, ref, update, set, get } from "@/lib/firebase";
import { PokerCard } from "@/components/PokerCard";
import { PlayerList } from "@/components/PlayerList";
import { UserInfoDialog } from "@/components/UserInfoDialog";
import { listenRoom, useRoomStore } from "@/store/roomStore";
import { useUserStore } from "@/store/userStore";
import { Player } from "@/model/room";
import { toast } from "sonner";
import { dbPaths } from "@/lib/utils";
import { ShimmerButton } from "@/components/ui/shimmer";
import PlayerStatusList from "@/components/PlayerStatusList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PokerChartBar } from "@/components/PokerChartBar";
import { PokerChartPie } from "@/components/PokerChartPie";
import { AnimatePresence, motion } from "framer-motion";
import { PokerChartData } from "@/model/chart";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import { LiveClock } from "@/components/ui/clock";

interface PokerRoomProps {
  roomId: string;
}

const chartData: PokerChartData[] = [
  { Point: "1", Count: 2 },
  { Point: "2", Count: 5 },
  { Point: "3", Count: 3 },
  { Point: "5", Count: 2 },
  { Point: "☕", Count: 1 },
];

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

  const isRoomVoted = useMemo(() => {
    if (!room) return false;
    // Check if any player has voted
    return Object.values(room.players).some((player) => player?.vote);
  }, [room]);

  const vote = async (point: string | null) => {
    if (!userInfo || !room) {
      toast.error(
        `Cannot vote: ${
          !userInfo ? "User information" : "Room data"
        } is missing.`
      );
      return;
    }
    try {
      const playerRef = ref(db, dbPaths.player(roomId, userInfo.id));
      await update(playerRef, { vote: point });
    } catch (error) {
      toast.error("Failed to submit vote: " + error);
      throw error;
    }
  };

  const revealVotes = async () => {
    if (!userPlayer?.isAdmin) return;
    try {
      await update(ref(db, dbPaths.room(roomId)), { isRevealed: true });
    } catch (error) {
      toast.error("Failed to reveal votes: " + error);
      throw error;
    }
  };

  const resetRound = async () => {
    try {
      const roomRef = ref(db, dbPaths.room(roomId));
      const snapshot = await get(ref(db, dbPaths.players(roomId)));

      const updates: Record<string, boolean | null> = {
        isRevealed: false,
      };

      if (snapshot.exists()) {
        Object.keys(snapshot.val()).forEach((uid) => {
          updates[dbPaths.vote(uid)] = null;
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
      const playerRef = ref(db, dbPaths.player(roomId, playerId));
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

      <div className="min-h-screen bg-[#F8F9FE] flex flex-col">
        {/* Header */}
        <header className="bg-white py-4 px-10 shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {room?.name || "Planning Poker"}
            </h2>
            <span className="text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          {userInfo && (
            <div className="flex items-center gap-3">
              <div
                className="w-36 flex items-center gap-2 cursor-pointer hover:opacity-80 hover:bg-gradient-to-b "
                onClick={() => setUserDialogVisibility(true)}
              >
                <Avatar className="w-10 h-10 ">
                  <AvatarImage
                    src={`/avatars/1.jpg`}
                    className="w-full h-full object-cover "
                    alt={`${userInfo.name}'s avatar`}
                  />
                  <AvatarFallback className="w-8 h-8 bg-gray-100 flex items-center justify-center text-sm text-gray-600 font-bold">
                    {userInfo.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {userInfo.name}
                </span>
              </div>
            </div>
          )}
        </header>
        <main className="flex-1 p-8 flex justify-center relative pb-40">
          <div className="absolute top-0 left-6 max-h-[80vh] overflow-y-auto hidden sm:block">
            <PlayerStatusList />
          </div>
          {/* Voting Area */}
          <div className="mb-12">
            <div className="relative">
              <ShimmerButton
                title={
                  userPlayer?.isAdmin
                    ? isRevealed
                      ? "Reset"
                      : "Reveal"
                    : userPlayer?.vote
                    ? "Vote Submitted"
                    : "Waiting for your vote"
                }
                onClick={() => {
                  if (!userPlayer?.isAdmin) return;
                  if (isRevealed) {
                    resetRound();
                  } else {
                    revealVotes();
                  }
                }}
                readonly={!userPlayer?.isAdmin || !isRoomVoted}
                variant={isRoomVoted ? "linear" : "conic"}
              />
              <PlayerList
                players={room?.players || {}}
                isRevealed={room?.isRevealed || false}
              />
            </div>
          </div>
          {/* Card Selection */}
          {room?.cardSet && room.cardSet.length > 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[80vw] flex flex-col items-center">
              <AnimatePresence mode="wait">
                {(!isRevealed || userPlayer?.isObserver) && (
                  <motion.div
                    key="choose-cards"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="w-full flex flex-col items-center"
                  >
                    <h3 className="text-lg font-medium mb-4">
                      Choose your card
                    </h3>
                    <div className="w-full overflow-x-auto pb-8">
                      <div className="flex justify-center gap-4 min-w-min px-4 pt-4 ">
                        {room.cardSet.map((p) => (
                          <div
                            key={p}
                            className={`transform-gpu transition-transform duration-200 ${
                              userPlayer?.vote === p
                                ? ""
                                : "hover:-translate-y-2"
                            }`}
                          >
                            <PokerCard
                              point={p}
                              active={userPlayer?.vote === p}
                              onClick={() =>
                                vote(userPlayer?.vote === p ? null : p)
                              }
                              disabled={isRevealed}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                {isRevealed && (
                  <div className="flex items-center justify-around min-w-100">
                    <PokerChartBar chartData={chartData} />
                    <PokerChartPie chartData={chartData} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
          {/* Fireworks if all vote the same */}
          {isRevealed && chartData.length == 1 && (
            <Realistic autorun={{ speed: 3, duration: 3 }} />
          )}
          <div className="hidden sm:block absolute top-10 right-20">
            <LiveClock />
          </div>
        </main>
      </div>
    </>
  );
}
