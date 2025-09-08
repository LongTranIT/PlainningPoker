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
import { useUserStore } from "@/store/userStore";

interface Props {
  open: boolean;
  onSave: (name: string, avatar: string) => void;
}

export function UserInfoDialog({ open, onSave }: Props) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  const handleSave = async () => {
    if (!name || !selectedAvatar) {
      alert("Please enter your name and select an avatar");
      return;
    }

    // Save user info
    await setUserInfo(name, selectedAvatar);
    onSave(name, selectedAvatar);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
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
