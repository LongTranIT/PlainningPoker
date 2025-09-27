"use client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { Player } from "@/model/room";
import { CrownIcon } from "./icon/king";
import clsx from "clsx";

// interface Player {
//   id: string | number;
//   name: string;
//   initial: string;
//   vote?: string | number;
// }

// export const waitingPlayers: Player[] = [
//   { id: 1, name: "Long Tran", initial: "A", vote: 5 },
//   { id: 2, name: "Bob", initial: "B", vote: 8 },
//   { id: 3, name: "Charlie", initial: "C", vote: 8 },
//   { id: 4, name: "Bob2", initial: "B", vote: 8 },
//   { id: 5, name: "Bob1", initial: "B", vote: 8 },
// ];

// export const votedPlayers: Player[] = [
//   { id: 6, name: "Diana", initial: "D", vote: 5 },
//   { id: 7, name: "Eve", initial: "E", vote: 8 },
// ];

// export const observerPlayers: Player[] = [
//   { id: 8, name: "Frank", initial: "F" },
//   { id: 9, name: "Grace", initial: "G" },
// ];

interface PlayerSectionProps {
  title: string;
  icon: string;
  players: Player[];
  showVote?: "show" | "hide";
  voteColor?: string;
}

interface PlayerSectionListProps {
  players: Player[];
  isRevealed?: boolean;
}

function PlayerSection({
  title,
  icon,
  players,
  showVote,
  voteColor,
}: PlayerSectionProps) {
  return (
    <div className="min-h-40">
      <h3 className="font-semibold text-gray-500 flex items-center gap-2 p-3 text-xl">
        {title} <span className="text-gray-400">{icon}</span>
      </h3>

      <div className="flex flex-col gap-3 w-full">
        <AnimatePresence>
          {players.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={clsx(
                  "flex flex-row items-center justify-between gap-3 rounded-xl border shadow-sm px-4 py-2 h-12",
                  p.isOffline && "opacity-50"
                )}
              >
                {/* Avatar */}
                <div className="relative w-8 h-8">
                  <Avatar className="w-8 h-8 rounded-md">
                    <AvatarImage
                      src={p.avatar}
                      alt={p.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-sm font-semibold">
                      {p.avatar}
                    </AvatarFallback>
                  </Avatar>

                  {p.isAdmin && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <CrownIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                {/* Name */}
                <span className="font-medium truncate flex-1">{p.name}</span>

                {/* Vote number (if needed) */}
                {showVote && (
                  <Avatar
                    className={`w-8 h-8 rounded-md ${
                      voteColor || "bg-gray-100"
                    }`}
                  >
                    <AvatarFallback className="text-sm font-semibold text-gray-700">
                      {showVote === "show" ? p.vote ?? "?" : "?"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PlayerSections({
  players,
  isRevealed,
}: PlayerSectionListProps) {
  // const [players, setPlayers] = useState<Player[]>([
  //   { id: 1, name: "Alice", initial: "A", vote: 5 },
  //   { id: 2, name: "Bob", initial: "B", vote: 8 },
  // ]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setPlayers((prev) => {
  //       if (prev.length > 0 && Math.random() > 0.5) {
  //         // ❌ Xóa random vị trí
  //         const index = Math.floor(Math.random() * prev.length);
  //         return prev.filter((_, i) => i !== index);
  //       } else {
  //         // ➕ Thêm vào random vị trí
  //         const id = Date.now();
  //         const newPlayer: Player = {
  //           id,
  //           name: `Player ${id % 100}`,
  //           initial: String.fromCharCode(65 + (id % 26)),
  //           vote: Math.floor(Math.random() * 13),
  //         };
  //         const index = Math.floor(Math.random() * (prev.length + 1));
  //         const newArr = [...prev];
  //         newArr.splice(index, 0, newPlayer);
  //         return newArr;
  //       }
  //     });
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);
  const votedPlayers = players.filter((p) => p.vote && !p.isObserver);
  const waitingPlayers = players.filter((p) => !p.vote && !p.isObserver);
  const observerPlayers = players.filter((p) => p.isObserver);
  return (
    <motion.div
      layout
      className="w-60 pb-4 pr-4 space-y-6"
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <PlayerSection
        title="Voted"
        icon="✅"
        players={votedPlayers}
        showVote={isRevealed ? "show" : "hide"}
        voteColor="bg-gray-100"
      />
      <PlayerSection title="Waiting" icon="⏱" players={waitingPlayers} />
      {observerPlayers.length > 0 && (
        <PlayerSection title="Observer" icon="👀" players={observerPlayers} />
      )}
    </motion.div>
  );
}
