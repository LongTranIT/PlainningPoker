"use client";

import { avatars } from "@/constants/avatars";
import Image from "next/image";
import clsx from "clsx";

interface Props {
  selected: string;
  onSelect: (avatar: string) => void;
}

export const AvatarPicker = ({ selected, onSelect }: Props) => {
  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {avatars.map((avatar) => (
        <button
          key={avatar.id}
          onClick={() => onSelect(avatar.src)}
          className={clsx(
            "border-2 rounded-full p-1 cursor-pointer transition-all duration-200",
            "hover:scale-110 hover:shadow-lg",
            selected === avatar.src
              ? `border-[${avatar.color}] ring-2 ring-[${avatar.color}] ring-opacity-50`
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={avatar.src}
              alt={avatar.alt}
              width={64}
              height={64}
              className="transform transition-transform hover:scale-105"
            />
          </div>
        </button>
      ))}
    </div>
  );
};
