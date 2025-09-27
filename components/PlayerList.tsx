import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { PokerCard } from "./PokerCard";
import { AnimatePresence, motion } from "framer-motion";
import { CrownIcon } from "./icon/king";
import { Player } from "@/model/room";
import clsx from "clsx";

interface PlayerListProps {
  players: Record<string, Player>;
  isRevealed: boolean;
}

const PlayerCard = ({
  player,
  isRevealed,
}: {
  player: Player;
  isRevealed: boolean;
}) => (
  <div
    className={clsx(
      "flex flex-col items-center",
      player.isOffline && "opacity-50"
    )}
  >
    <div className="mb-2">
      <PokerCard
        point={player.vote ? (isRevealed ? player.vote : "🤫") : ""}
        active={!!player.vote}
        width={40}
        readOnly
      />
    </div>
    <div className="relative">
      <div className="w-12 h-12">
        <Avatar className="w-full h-full rounded-full">
          <AvatarImage
            src={player.avatar}
            className="w-full h-full object-cover rounded-full"
            alt={`${player.name}'s avatar`}
          />
          <AvatarFallback className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-600 font-bold">
            {(player.name || "")
              .split(" ")
              .map((word) => word[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </AvatarFallback>
          {player.isAdmin && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <CrownIcon className="w-4 h-4 text-white" />
            </div>
          )}
        </Avatar>
      </div>
      <span
        className="absolute -bottom-5 left-1/2 -translate-x-1/2 
             text-xs font-medium whitespace-nowrap 
             overflow-hidden text-ellipsis max-w-[80px] text-center"
      >
        {player.name}
      </span>
    </div>
  </div>
);

export const PlayerList = ({ players, isRevealed }: PlayerListProps) => {
  const playerEntries = Object.entries(players).filter(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, p]) => !p.isObserver
  );
  // const [count, setCount] = useState(10);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCount((prev) => {
  //       const dir = Math.random() > 0.5 ? 1 : -1; // random tăng hoặc giảm
  //       const next = prev + dir;
  //       return next;
  //     });
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, [playerEntries.length]);

  return (
    <motion.div
      layout
      className="
        relative mx-auto mt-8 mb-8
        flex flex-wrap justify-center gap-12 w-[60%]
        max-sm:w-[90vw] max-sm:flex-nowrap max-sm:justify-start
        max-sm:overflow-x-auto max-sm:pb-8
      "
    >
      <AnimatePresence>
        {/* {[...Array(count)].map(() => */}
        {playerEntries.map(([userId, player]) => (
          <motion.div
            key={userId}
            layout
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PlayerCard player={player} isRevealed={isRevealed} />
          </motion.div>
        ))}
        {/* )} */}
      </AnimatePresence>
    </motion.div>
  );
};
