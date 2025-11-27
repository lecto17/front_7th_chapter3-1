import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { PostForm } from "./PostForm";
import type { PostFormData } from "../../schemas/postSchema";
import type { Post } from "../../services/postService";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => void | Promise<void>;
  post: Post | null;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  post,
}) => {
  const handleSubmit = async (data: PostFormData) => {
    await onSubmit(data);
    onClose();
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>게시글 수정</DialogTitle>
        </DialogHeader>
        <PostForm
          defaultValues={{
            title: post.title,
            content: post.content,
            author: post.author,
            category: post.category,
            status: post.status,
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="수정"
        />
      </DialogContent>
    </Dialog>
  );
};
