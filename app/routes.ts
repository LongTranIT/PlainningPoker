export const ROUTES = {
  HOME: "/",
  ROOM_DETAIL: (id: string) => `/rooms/${id}`,
} as const;
