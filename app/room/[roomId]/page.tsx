import { PokerRoom } from "./PokerRoom";

interface PageParams {
  roomId: string;
}

interface Props {
  params: Promise<PageParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PokerRoomPage({ params }: Props) {
  // Wait for params to resolve
  const resolvedParams = await params;

  return (
    <section>
      <PokerRoom roomId={resolvedParams.roomId} />
    </section>
  );
}
