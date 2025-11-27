import { useState } from 'react';
import { useModal } from './useModal';
import { useNotification } from './useNotification';
import { postService } from '@/services/postService';
import type { Post } from '@/services/postService';
import type { PostFormData } from '@/schemas/postSchema';

interface UsePostHandlersProps {
  create: (formData: PostFormData) => Promise<void>;
  update: (id: number, formData: PostFormData) => Promise<void>;
  deleteEntity: (id: number) => Promise<void>;
}

export function usePostHandlers({
  create,
  update,
  deleteEntity
}: UsePostHandlersProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const postModal = useModal();
  const { showSuccess, showError } = useNotification();

  const handleCreatePost = async (formData: PostFormData) => {
    try {
      await create(formData);
      showSuccess('게시글이 생성되었습니다');
    } catch (error) {
      showError(error instanceof Error ? error.message : '생성에 실패했습니다');
    }
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    postModal.open();
  };

  const handleUpdatePost = async (formData: PostFormData) => {
    if (!selectedPost) return;
    try {
      await update(selectedPost.id, formData);
      showSuccess('게시글이 수정되었습니다');
      setSelectedPost(null);
    } catch (error) {
      showError(error instanceof Error ? error.message : '수정에 실패했습니다');
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteEntity(id);
      showSuccess('삭제되었습니다');
    } catch (error) {
      showError(error instanceof Error ? error.message : '삭제에 실패했습니다');
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await postService.publish(id);
      showSuccess('게시되었습니다');
    } catch (error) {
      showError(error instanceof Error ? error.message : '게시에 실패했습니다');
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await postService.archive(id);
      showSuccess('보관되었습니다');
    } catch (error) {
      showError(error instanceof Error ? error.message : '보관에 실패했습니다');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await postService.restore(id);
      showSuccess('복원되었습니다');
    } catch (error) {
      showError(error instanceof Error ? error.message : '복원에 실패했습니다');
    }
  };

  const handleClosePostModal = () => {
    postModal.close();
    setSelectedPost(null);
  };

  return {
    selectedPost,
    postModal,
    handleCreatePost,
    handleEditPost,
    handleUpdatePost,
    handleDeletePost,
    handlePublish,
    handleArchive,
    handleRestore,
    handleClosePostModal
  };
}
