"use client";
import React, { useState } from "react";
import { toast } from "sonner";

interface CopyButtonProps {
  textCopy: string;
  title: string;
}

const CopyIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path
      d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6
      a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
    />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function CopyRoomIdButton({ textCopy, title }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textCopy);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = textCopy;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Copy failed: " + err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
    >
      {!copied ? (
        <>
          <CopyIcon className="w-4 h-4" />
          <span>{title}</span>
        </>
      ) : (
        <>
          <CheckIcon className="w-4 h-4 text-purple-500" />
          <span className="text-purple-500">Copied!</span>
        </>
      )}
    </button>
  );
}
