"use client";

import { Eye, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ObserverSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function ObserverSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: ObserverSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "bg-blue-600 hover:bg-blue-700"
          : "bg-green-600 hover:bg-green-700",
        className
      )}
    >
      <span className="sr-only">
        {checked ? "Switch to active mode" : "Switch to observer mode"}
      </span>

      {/* Toggle thumb */}
      <span
        className={cn(
          "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out flex items-center justify-center",
          checked ? "translate-x-6" : "translate-x-0"
        )}
      >
        {/* Icon container with smooth transition */}
        <span className="relative w-4 h-4">
          <Eye
            className={cn(
              "absolute inset-0 w-4 h-4 text-blue-600 transition-all duration-200",
              checked
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-75 rotate-45"
            )}
          />
          <User
            className={cn(
              "absolute inset-0 w-4 h-4 text-green-600 transition-all duration-200",
              !checked
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-75 -rotate-45"
            )}
          />
        </span>
      </span>
    </button>
  );
}
