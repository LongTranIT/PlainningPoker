"use client";
import { db, ref, update } from "@/lib/firebase";
import { dbPaths } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { Player } from "@/model/room";
import { CrownIcon } from "./icon/king";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Eye, User } from "lucide-react";

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
  roomId: string;
  isAdmin: boolean;
  currentUserId: string;
  onChangeAdmin: (playerId: string) => void;
  onToggleObserver?: (playerId: string) => void;
}

interface PlayerSectionListProps {
  players: Player[];
  isRevealed?: boolean;
  roomId: string;
  currentUserId: string;
}

function PlayerSection({
  title,
  icon,
  players,
  showVote,
  voteColor,
  isAdmin,
  currentUserId,
  onChangeAdmin,
  onToggleObserver,
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
              <DropdownMenu
                open={isAdmin && currentUserId !== p.id ? undefined : false}
              >
                <DropdownMenuTrigger asChild>
                  <Card
                    className={clsx(
                      "flex flex-row items-center justify-between gap-3 rounded-xl border shadow-sm px-4 py-2 h-12",
                      p.isOffline && "opacity-50",
                      isAdmin &&
                        currentUserId !== p.id &&
                        "cursor-pointer hover:bg-gray-50"
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
                    <span className="font-medium truncate flex-1">
                      {p.name}
                    </span>

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
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 cursor-pointer"
                  side="right"
                  align="start"
                >
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem onClick={() => onChangeAdmin(p.id)}>
                    <CrownIcon className="w-4 h-4 text-yellow-400" />
                    Assign as Admin
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    onClick={() => onToggleObserver?.(p.id)}
                  >
                    {p.isObserver ? (
                      <User className="text-purple-400" />
                    ) : (
                      <Eye className="text-pink-400" />
                    )}
                    {p.isObserver ? "Make Player" : "Make Observer"}
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
  roomId,
  currentUserId,
}: PlayerSectionListProps) {
  // const [players, setPlayers] = useState<Player[]>([
  //   { id: 1, name: "Alice", initial: "A", vote: 5 },
  //   { id: 2, name: "Bob", initial: "B", vote: 8 },
  // ]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setPlayers((prev) => {
  //       if (prev.length > 0 && Math.random() > 0.5) {
  //         const index = Math.floor(Math.random() * prev.length);
  //         return prev.filter((_, i) => i !== index);
  //       } else {
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

  const isAdmin = players.find((p) => p.id === currentUserId)?.isAdmin ?? false;

  const handleToggleObserver = async (playerId: string) => {
    try {
      // Only allow admin to toggle observer status
      const currentPlayer = players.find((p) => p.id === currentUserId);
      if (!currentPlayer?.isAdmin) {
        toast.error("Only admin can change player status");
        return;
      }

      const targetPlayer = players.find((p) => p.id === playerId);
      if (!targetPlayer) {
        toast.error("Player not found");
        return;
      }

      // Update player's observer status
      await update(ref(db, dbPaths.player(roomId, playerId)), {
        isObserver: !targetPlayer.isObserver,
        // Clear vote when making observer
        vote: null,
      });

      toast.success(
        targetPlayer.isObserver
          ? `${targetPlayer.name} changed to player`
          : `${targetPlayer.name} changed to observer`
      );
    } catch (error) {
      toast.error("Failed to change player status: " + error);
    }
  };

  const handleAssignAdmin = async (playerId: string) => {
    try {
      // Only allow current admin to assign new admin
      const currentPlayer = players.find((p) => p.id === currentUserId);
      if (!currentPlayer?.isAdmin) {
        toast.error("Only admin can assign new admin");
        return;
      }

      // Assign admin to selected player
      await update(ref(db, dbPaths.player(roomId, playerId)), {
        isAdmin: true,
      });

      // Remove admin from current user
      await update(ref(db, dbPaths.player(roomId, currentUserId)), {
        isAdmin: false,
      });

      toast.success("Admin role transferred successfully");
    } catch (error) {
      toast.error("Failed to assign admin: " + error);
    }
  };
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
        roomId={roomId}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
        onChangeAdmin={handleAssignAdmin}
        onToggleObserver={handleToggleObserver}
      />
      <PlayerSection
        title="Waiting"
        icon="⏱"
        players={waitingPlayers}
        roomId={roomId}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
        onChangeAdmin={handleAssignAdmin}
        onToggleObserver={handleToggleObserver}
      />
      {observerPlayers.length > 0 && (
        <PlayerSection
          title="Observer"
          icon="👀"
          players={observerPlayers}
          roomId={roomId}
          isAdmin={isAdmin}
          currentUserId={currentUserId}
          onChangeAdmin={handleAssignAdmin}
          onToggleObserver={handleToggleObserver}
        />
      )}
    </motion.div>
  );
}
