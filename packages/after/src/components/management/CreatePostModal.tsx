import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { PostForm } from "./PostForm";
import type { PostFormData } from "../../schemas/postSchema";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => void | Promise<void>;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = async (data: PostFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>게시글 생성</DialogTitle>
        </DialogHeader>
        <PostForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="생성"
        />
      </DialogContent>
    </Dialog>
  );
};
