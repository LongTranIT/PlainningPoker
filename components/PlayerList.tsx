import { Card } from "@/components/ui/card";

interface PlayerListProps {
  votes: Record<string, number | string | null>;
  revealed: boolean;
}

export const PlayerList = ({ votes, revealed }: PlayerListProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(votes).map(([name, point]) => (
        <Card key={name} className="p-4 flex justify-between">
          <span>{name}</span>
          <span className="font-bold">{revealed ? point ?? "?" : "🤫"}</span>
        </Card>
      ))}
    </div>
  );
};
