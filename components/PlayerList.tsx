import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { PokerCard } from "./PokerCard";
import { AnimatePresence, motion } from "framer-motion";

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

const PlayerAvatar = ({
  player,
  isRevealed,
}: {
  player: Player;
  isRevealed: boolean;
}) => (
  <div className="flex flex-col items-center group">
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
            {player.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </AvatarFallback>
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

export const PlayerList = ({ players, isRevealed }: Props) => {
  const playerEntries = Object.entries(players);
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
            <PlayerAvatar player={player} isRevealed={isRevealed} />
          </motion.div>
        ))}
        {/* )} */}
      </AnimatePresence>
    </motion.div>
  );
};
