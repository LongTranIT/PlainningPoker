"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarPicker } from "@/components/AvatarPicker";
import { saveUserInfo } from "@/lib/localStorage";

interface Props {
  open: boolean;
  onSave: (name: string, avatar: string) => void;
}

export function UserInfoDialog({ open, onSave }: Props) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const handleSave = async () => {
    if (!name || !selectedAvatar) {
      alert("Please enter your name and select an avatar");
      return;
    }

    // Save user info
    await saveUserInfo(name, selectedAvatar);
    onSave(name, selectedAvatar);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Planning Poker</DialogTitle>
          <DialogDescription>
            Please enter your name and choose an avatar to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <AvatarPicker
            selected={selectedAvatar}
            onSelect={setSelectedAvatar}
          />
          <Button
            onClick={handleSave}
            disabled={!name || !selectedAvatar}
            className="w-full"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
