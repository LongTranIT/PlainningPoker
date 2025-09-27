"use client";

import { useEffect, useMemo } from "react";
import { db, ref, update, set, get, remove } from "@/lib/firebase";
import { PokerCard } from "@/components/PokerCard";
import { PlayerList } from "@/components/PlayerList";
import { listenRoom, useRoomStore } from "@/store/roomStore";
import { useUserStore } from "@/store/userStore";
import type { Player } from "@/model/room";
import { toast } from "sonner";
import { dbPaths, nameOfFactory } from "@/lib/utils";
import { ShimmerButton } from "@/components/ui/shimmer";
import PlayerStatusList from "@/components/PlayerStatusList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PokerChartBar } from "@/components/PokerChartBar";
import { PokerChartPie } from "@/components/PokerChartPie";
import { AnimatePresence, motion } from "framer-motion";
import { PokerChartData } from "@/model/chart";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import { useRouter } from "next/navigation";
import PokerHeading from "@/components/PokerHeading";
import CopyButton from "@/components/ui/copy-button";
import { ROUTES } from "@/app/routes";
import { ObserverSwitch } from "@/components/ObserverSwitch";
import dynamic from "next/dynamic";

interface PokerRoomProps {
  roomId: string;
}

const LiveClock = dynamic(() => import("@/components/ui/clock"), {
  ssr: false,
});
const nameOfPlayer = nameOfFactory<Player>();

export function PokerRoom({ roomId }: PokerRoomProps) {
  const router = useRouter();
  const { room, getIsRevealed, getPlayer } = useRoomStore();
  const { hydrated, userInfo } = useUserStore();

  const isRevealed = getIsRevealed();
  const userPlayer = getPlayer(userInfo?.id || "");

  useEffect(() => {
    const unsubscribe = listenRoom(roomId);
    return () => unsubscribe(); // cleanup
  }, [roomId]);

  useEffect(() => {
    if (!hydrated) return; // Wait until the user store is hydrated
    if (!userInfo) {
      router.push("/?redirect=" + encodeURIComponent(`${roomId}`));
      return;
    }

    const checkRoomAndAddPlayer = async () => {
      try {
        // Check if room exists in Firebase
        const roomRef = ref(db, dbPaths.room(roomId));
        const roomSnapshot = await get(roomRef);

        if (!roomSnapshot.exists()) {
          toast.error("Room does not exist or has been closed.");
          return;
        }

        // Add user to room if not already present
        await addPlayer(userInfo.id, userInfo.name, userInfo.avatar);
      } catch (error) {
        toast.error("Error checking room: " + error);
      }
    };

    checkRoomAndAddPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, hydrated]);

  useEffect(() => {
    if (!userInfo) return;
    const handleBeforeUnload = () => {
      handlePlayerLeave();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userInfo, userPlayer, room]);

  const handlePlayerLeave = () => {
    if (!userInfo || !room) return;

    try {
      if (userPlayer?.isAdmin) {
        const userPlayerNewState = { ...userPlayer, isOffline: true };
        set(
          ref(db, dbPaths.player(room.roomId, userInfo.id)),
          userPlayerNewState
        );
        return;
      }

      const playerRef = ref(db, dbPaths.player(room.roomId, userInfo.id));
      remove(playerRef);
    } catch (error) {
      toast.error("Failed to remove player: " + error);
    }
  };

  const isRoomVoted = useMemo(() => {
    if (!room) return false;
    // Check if any player has voted
    return Object.values(room.players ?? {}).some((player) => player?.vote);
  }, [room]);

  const players = useMemo(() => {
    if (!room) return [];
    return Object.values(room.players ?? {});
  }, [room]);

  const chartData: PokerChartData[] = useMemo(() => {
    if (!room) return [];
    const voteCount: Record<string, number> = {};
    Object.values(room.players ?? {}).forEach((player) => {
      if (player.vote) {
        voteCount[player.vote] = (voteCount[player.vote] || 0) + 1;
      }
    });
    return Object.entries(voteCount).map(([point, count]) => ({
      Point: point,
      Count: count,
    }));
  }, [room]);

  const getButtonTitle = (
    isAdminOffline: boolean,
    player: Player | null,
    isRevealed: boolean
  ) => {
    if (isAdminOffline) return "Admin is offline";
    if (player?.isAdmin) return isRevealed ? "Reset" : "Reveal";
    if (player?.isObserver) return "Observer";
    return player?.vote ? "Vote Submitted" : "Waiting for your vote";
  };

  const isAdminOffline = useMemo(() => {
    if (!room) return false;
    return Object.values(room.players ?? {}).some(
      (player) => player.isAdmin && player.isOffline
    );
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
        const statusRef = ref(db, dbPaths.player(roomId, playerId));
        await update(statusRef, { [nameOfPlayer("isOffline")]: false });
        return;
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

  const handleObserverChange = async (isObserver: boolean) => {
    if (!userInfo || !room) return;
    const playerRef = ref(db, dbPaths.player(room.roomId, userInfo.id));
    await update(playerRef, {
      [nameOfPlayer("isObserver")]: isObserver,
      [nameOfPlayer("vote")]: null,
    });
    toast.success(`You are now an ${isObserver ? "observer" : "participant"}.`);
  };

  return (
    <div
      className="min-h-screen bg-[#F8F9FE] flex flex-col"
      style={{
        backgroundImage: `
        linear-gradient(to right, #f0f0f0 1px, transparent 1px),
        linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
        radial-gradient(circle 800px at 100% 200px, #d5c5ff, transparent)
      `,
        backgroundSize: "96px 64px, 96px 64px, 100% 100%",
      }}
    >
      {/* Header */}
      <header className="bg-white py-4 px-9 shadow-sm flex justify-between items-center">
        <div className="flex items-end gap-4">
          <PokerHeading
            size="sm"
            onClick={() => {
              handlePlayerLeave();
              router.push(ROUTES.HOME);
            }}
          />
          <span className="hidden sm:inline text-gray-500 ">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        {userInfo && (
          <div className="flex items-center gap-6 overflow-auto">
            <CopyButton
              textCopy={window.location.origin + ROUTES.ROOM_DETAIL(roomId)}
              title="RoomID"
            />
            <ObserverSwitch
              checked={userPlayer?.isObserver || false}
              onCheckedChange={(checked) => {
                handleObserverChange(checked);
              }}
            />
            <div
              className="w-36 flex items-center gap-2 cursor-pointer hover:opacity-80 hover:bg-gradient-to-b "
              onClick={() => {
                router.push("/?redirect=" + encodeURIComponent(`${roomId}`));
              }}
            >
              <Avatar className="w-10 h-10 ">
                <AvatarImage
                  src={userInfo.avatar}
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
              <span
                className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 
             overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]"
              >
                {userInfo.name}
              </span>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1 p-8 flex justify-center relative pb-40">
        <div className="absolute top-0 left-6 max-h-[80vh] overflow-y-auto hidden sm:block z-10">
          <PlayerStatusList
            players={players}
            isRevealed={isRevealed}
            roomId={roomId}
            currentUserId={userInfo?.id || ""}
          />
        </div>
        {/* Voting Area */}
        <div className="mb-12">
          <div className="relative">
            <ShimmerButton
              title={getButtonTitle(isAdminOffline, userPlayer, isRevealed)}
              onClick={() => {
                if (!userPlayer?.isAdmin) return;
                if (isRevealed) {
                  resetRound();
                } else {
                  revealVotes();
                }
              }}
              readonly={!userPlayer?.isAdmin || (!isRevealed && !isRoomVoted)}
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
              {!isRevealed && !userPlayer?.isObserver && (
                <motion.div
                  key="choose-cards"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-full flex flex-col items-center"
                >
                  <h3 className="text-lg font-medium mb-4">Choose your card</h3>
                  <div className="w-full overflow-x-auto pb-8">
                    <div className="flex justify-center gap-4 min-w-min px-4 pt-4 ">
                      {room.cardSet.map((p) => (
                        <div
                          key={p}
                          className={`transform-gpu transition-transform duration-200 ${
                            userPlayer?.vote === p ? "" : "hover:-translate-y-2"
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
  );
}
