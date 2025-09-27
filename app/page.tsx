"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { db, get, ref, set, update } from "@/lib/firebase";
import { dbPaths, generateId } from "@/lib/utils";
import { DEFAULT_CARD_SET, Player, Room } from "@/model/room";
import { useRoomStore } from "@/store/roomStore";
import { ROUTES } from "./routes";
import Carousel from "@/components/ui/carousel";
import { cardData } from "@/model/avatar";
import PokerHeading from "@/components/PokerHeading";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { ObserverSwitch } from "@/components/ObserverSwitch";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isObserver, setIsObserver] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [bgColor, setBgColor] = useState("bg-white");
  const { userInfo, setUserInfo } = useUserStore();
  const { setRoom } = useRoomStore();
  const searchParams = useSearchParams();
  const redirectRoomId = searchParams.get("redirect");
  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.name);
      setSelectedAvatar(userInfo.avatar);
      setIsObserver(!!userInfo.isObserver);
    }
  }, [userInfo]);

  const handleJoin = async () => {
    try {
      if (!userName || !selectedAvatar) {
        alert("Please enter your name and select an avatar!");
        return;
      }

      setIsJoining(true);

      const finalUser =
        !userInfo ||
        userInfo.name !== userName ||
        userInfo.avatar !== selectedAvatar ||
        userInfo.isObserver !== isObserver
          ? setUserInfo(userName, selectedAvatar, isObserver)
          : userInfo;
      const roomId = redirectRoomId || generateId();

      if (redirectRoomId) {
        const playerRef = ref(db, dbPaths.player(roomId, finalUser.id));
        const snapshot = await get(playerRef);
        if (snapshot.exists()) {
          update(playerRef, {
            name: finalUser.name,
            avatar: finalUser.avatar,
            isObserver: finalUser.isObserver,
          });
        } else {
          const now = new Date().toISOString();

          const player: Player = {
            id: finalUser.id,
            name: finalUser.name,
            avatar: finalUser.avatar,
            vote: null,
            isAdmin: false,
            isObserver: finalUser.isObserver,
            joinedAt: now,
          };
          await set(playerRef, player);
        }
      } else {
        // Initialize room data
        const roomRef = ref(db, dbPaths.room(roomId));
        const now = new Date().toISOString();

        const adminPlayer: Player = {
          id: finalUser.id,
          name: finalUser.name,
          avatar: finalUser.avatar,
          vote: null,
          isAdmin: true,
          isObserver: finalUser.isObserver,
          joinedAt: now,
        };

        const room: Room = {
          roomId: roomId,
          name: "Planning Poker",
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
      }
      // Navigate to room
      await router.push(ROUTES.ROOM_DETAIL(roomId));
    } catch (error) {
      toast.error("Error joining room: " + error);
    } finally {
      // setIsJoining(false);
    }
  };

  return (
    <main
      className={clsx(
        "flex flex-col items-center justify-center h-screen space-y-4 transition-colors duration-700",
        bgColor
      )}
    >
      <PokerHeading />
      <div className="flex w-[80%] md:w-[40%] justify-around items-center">
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-64"
        />
      </div>
      <div className="flex w-[80%] md:w-[40%] justify-around items-center">
        <Label htmlFor="name">User Mode</Label>
        <div className="w-64 flex items-center gap-3">
          <ObserverSwitch
            checked={isObserver}
            onCheckedChange={(checked) => {
              setIsObserver(checked);
            }}
          />
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                isObserver ? "bg-pink-500" : "bg-purple-500"
              }`}
            />
            <span className="text-sm text-muted-foreground">
              {isObserver
                ? "Participate without voting"
                : "Participate in voting"}
            </span>
          </div>
        </div>
      </div>
      <Carousel
        className="w-[90%] md:w-[60%] h-[70%]"
        cardData={cardData}
        onChange={(card) => {
          setSelectedAvatar(card.imageUrl);
          setBgColor(card.bgColor ?? "bg-white");
        }}
        initCardId={
          userInfo
            ? cardData.find((card) => card.imageUrl === userInfo.avatar)?.id
            : undefined
        }
      />
      <Button
        className="
        w-64 h-10 cursor-pointer
         text-white font-medium rounded-lg px-6 py-3
        bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400
        animate-gradient
        transition-transform duration-300
        hover:scale-105 hover:shadow-md
      "
        onClick={handleJoin}
        disabled={!userName || !selectedAvatar || isJoining}
      >
        {isJoining
          ? "Joining..."
          : redirectRoomId
          ? "Join Room"
          : "Create Room"}
      </Button>
    </main>
  );
}
