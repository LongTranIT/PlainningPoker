export const ROUTES = {
  HOME: "/",
  ROOM_DETAIL: (id: string) => `/room/${id}`,
} as const;
