import React from "react";
import { Button } from "../ui/button";

interface UserPostSelectorProps {
  selected: "user" | "post";
  onSelect: (type: "user" | "post") => void;
}

export const UserPostSelector: React.FC<UserPostSelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={selected === "user" ? "default" : "outline"}
        onClick={() => onSelect("user")}
      >
        사용자 관리
      </Button>
      <Button
        variant={selected === "post" ? "default" : "outline"}
        onClick={() => onSelect("post")}
      >
        게시글 관리
      </Button>
    </div>
  );
};
