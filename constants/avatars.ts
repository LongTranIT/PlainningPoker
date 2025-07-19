interface Avatar {
  id: string;
  src: string;
  alt: string;
  color: string;
}

export const avatars: Avatar[] = [
  {
    id: "avatar1",
    src: "/avatars/avatar1.svg",
    alt: "Blue Avatar",
    color: "#4F46E5",
  },
  {
    id: "avatar2",
    src: "/avatars/avatar2.svg",
    alt: "Green Avatar",
    color: "#10B981",
  },
  {
    id: "avatar3",
    src: "/avatars/avatar3.svg",
    alt: "Pink Avatar",
    color: "#EC4899",
  },
  {
    id: "avatar4",
    src: "/avatars/avatar4.svg",
    alt: "Orange Avatar",
    color: "#F59E0B",
  },
  {
    id: "avatar5",
    src: "/avatars/avatar5.svg",
    alt: "Purple Avatar",
    color: "#6366F1",
  },
];
