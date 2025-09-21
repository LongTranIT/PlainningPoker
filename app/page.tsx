"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { db, ref, set } from "@/lib/firebase";
import { dbPaths, generateId } from "@/lib/utils";
import { DEFAULT_CARD_SET, Player, Room } from "@/model/room";
import { useRoomStore } from "@/store/roomStore";
import { ROUTES } from "./routes";
import Carousel from "@/components/ui/carousel";
import { cardData } from "@/model/avatar";
import PokerHeading from "@/components/PokerHeading";
import { Label } from "@/components/ui/label";
import clsx from "clsx";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [bgColor, setBgColor] = useState("bg-white");
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
      if (!userName || !selectedAvatar) {
        alert("Please enter your name and select an avatar!");
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

      const roomRef = ref(db, dbPaths.room(roomId));
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

      // Navigate to room
      await router.push(ROUTES.ROOM_DETAIL(roomId));
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Failed to join room. Please try again.");
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
        {isJoining ? "Joining..." : "Create Room"}
      </Button>
    </main>
  );
}
