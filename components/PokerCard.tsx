import { Card } from "@/components/ui/card";
import clsx from "clsx";

interface PokerCardProps {
  point: number | string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const PokerCard = ({
  point,
  selected,
  disabled,
  onClick,
}: PokerCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={clsx(
        "p-8 text-2xl text-center cursor-pointer transition hover:bg-gray-200",
        selected && "bg-blue-500 text-white"
      )}
      disabled={disabled}
    >
      {point}
    </Card>
  );
};
