import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { PostForm } from './PostForm';
import type { PostFormData } from '@/schemas/postSchema';
import type { Post } from '@/services/postService';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => void | Promise<void>;
  post?: Post | null; // If provided, it's in Edit mode
}

export const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  post
}) => {
  const isEditMode = !!post;

  const handleSubmit = async (data: PostFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? '게시글 수정' : '게시글 생성'}
          </DialogTitle>
        </DialogHeader>
        <PostForm
          defaultValues={
            post
              ? {
                  title: post.title,
                  content: post.content,
                  author: post.author
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel={isEditMode ? '수정 완료' : '생성'}
        />
      </DialogContent>
    </Dialog>
  );
};
