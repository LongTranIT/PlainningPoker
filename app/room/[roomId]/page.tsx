import { PokerRoom } from "./PokerRoom";

interface PageProps {
  params: {
    roomId: string;
  };
}

export default async function PokerRoomPage({ params }: PageProps) {
  // asynchronous access of `params.roomId`.
  const { roomId } = await params;
  return <PokerRoom roomId={roomId} />;
}
