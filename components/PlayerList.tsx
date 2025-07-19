import { Card } from "@/components/ui/card";
import Image from "next/image";

interface Vote {
  point: number | string;
  avatar: string;
}

interface Props {
  votes: Record<string, Vote>;
  revealed: boolean;
}

export const PlayerList = ({ votes, revealed }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(votes).map(([name, { point, avatar }]) => (
        <Card key={name} className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-full bg-gray-100">
              <Image
                src={avatar}
                alt={`${name}'s avatar`}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="font-medium">{name}</span>
          </div>
          <span className="text-xl font-bold">{revealed ? point : "🤫"}</span>
        </Card>
      ))}
    </div>
  );
};
