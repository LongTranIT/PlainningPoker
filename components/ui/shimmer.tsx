"use client";
import React from "react";
import { Button } from "./button";
import { clsx } from "clsx";

interface ShimmerButtonProps extends React.ComponentProps<"button"> {
  title: string;
  readonly?: boolean;
  variant?: "conic" | "linear"; // thêm prop mới
}

export const ShimmerButton = ({
  title,
  readonly,
  onClick,
  variant = "linear",
  ...props
}: ShimmerButtonProps) => {
  const customCss = `
    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }
    @keyframes shimmer-spin {
      to {
        --angle: 360deg;
      }
    }

    @keyframes shimmer-linear {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  const gradientStyle =
    variant === "conic"
      ? {
          background:
            "conic-gradient(from var(--angle), transparent 25%, #06b6d4, transparent 50%)",
          animation: "shimmer-spin 2.5s linear infinite",
        }
      : {
          background:
            "linear-gradient(270deg, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #06b6d4)",
          animation: "shimmer-linear 8s ease infinite",
        };

  return (
    <div className="flex items-center justify-center font-sans">
      <style>{customCss}</style>
      <Button
        className={clsx(
          "cursor-pointer relative inline-flex items-center justify-center p-[1.5px] rounded-full overflow-hidden group h-16 w-60",
          "bg-gray-300 dark:bg-black",
          { "opacity-50 cursor-not-allowed": readonly }
        )}
        onClick={readonly ? undefined : onClick}
        {...props}
      >
        <div className="absolute inset-0" style={gradientStyle} />
        <span className="relative z-10 inline-flex items-center justify-center w-full h-full px-8 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-900 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors duration-300">
          {title}
        </span>
      </Button>
    </div>
  );
};
