import { Card } from "@/components/ui/card";
import Image from "next/image";

interface Player {
  name: string;
  avatar: string;
  vote: string | null;
  isObserver: boolean;
  joinedAt: string;
}

interface Props {
  players: Record<string, Player>;
  isRevealed: boolean;
}

export const PlayerList = ({ players, isRevealed }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(players).map(([userId, player]) => (
        <Card key={userId} className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-full bg-gray-100">
              <Image
                src={`${player.avatar}`}
                alt={`${player.name}'s avatar`}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{player.name}</span>
              {player.isObserver && (
                <span className="text-sm text-gray-500">(Observer)</span>
              )}
            </div>
          </div>
          <span className="text-xl font-bold">
            {isRevealed ? player.vote || "-" : player.vote ? "🤫" : "-"}
          </span>
        </Card>
      ))}
    </div>
  );
};
