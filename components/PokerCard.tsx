import { Card } from "@/components/ui/card";
import clsx from "clsx";
import { motion } from "framer-motion";

interface PokerCardProps {
  point: number | string;
  active: boolean;
  disabled?: boolean;
  width?: number;
  readOnly?: boolean;
  onClick?: () => void;
}

export const PokerCard = ({
  point,
  active,
  disabled,
  width = 56,
  readOnly = false,
  onClick,
}: PokerCardProps) => {
  return (
    <div style={{ width, aspectRatio: "56/80" }}>
      <motion.div
        key={point}
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: -90, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full"
      >
        <Card
          onClick={!disabled ? onClick : undefined}
          className={clsx(
            "text-center transition-all duration-200 flex items-center justify-center w-full h-full p-4 rounded-md",
            { "cursor-pointer": !readOnly },
            active
              ? `bg-[#7C5CFC] text-white shadow-lg ${
                  readOnly ? "" : "-translate-y-2"
                }`
              : `bg-white border-2 border-transparent ${
                  !readOnly &&
                  "hover:border-[#7C5CFC] hover:text-[#7C5CFC] hover:shadow-xl transition-all duration-300"
                }`
          )}
          disabled={disabled}
        >
          <span
            className={clsx(
              "font-semibold",
              active ? "text-white" : "text-gray-700"
            )}
          >
            {point}
          </span>
        </Card>
      </motion.div>
    </div>
  );
};
