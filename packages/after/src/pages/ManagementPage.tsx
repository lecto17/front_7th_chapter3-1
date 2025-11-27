import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useEntityManagement } from '../hooks/useEntityManagement';
import { useModal } from '../hooks/useModal';
import { useNotification } from '../hooks/useNotification';
import { useEntityStats } from '../hooks/useEntityStats';
import { StatisticsCards } from '../components/management/StatisticsCards';
import { UserPostSelector } from '../components/management/UserPostSelector';
import { UserTable } from '../components/management/UserTable';
import { PostTable } from '../components/management/PostTable';
import { CreateUserModal } from '../components/management/CreateUserModal';
import { CreatePostModal } from '../components/management/CreatePostModal';
import { EditUserModal } from '../components/management/EditUserModal';
import { EditPostModal } from '../components/management/EditPostModal';
import { postService } from '../services/postService';
import type { User } from '../services/userService';
import type { Post } from '../services/postService';
import type { UserFormData } from '../schemas/userSchema';
import type { PostFormData } from '../schemas/postSchema';
import '../styles/components.css';

type EntityType = 'user' | 'post';

export const ManagementPage: React.FC = () => {
  // State
  const [entityType, setEntityType] = useState<EntityType>('post');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Hooks
  const { data, isLoading, create, update, deleteEntity } = useEntityManagement(entityType);
  const createUserModal = useModal();
  const createPostModal = useModal();
  const editUserModal = useModal();
  const editPostModal = useModal();
  const { notification, showSuccess, showError, dismiss } = useNotification();
  const stats = useEntityStats(data, entityType);

  // Handlers - User
  const handleCreateUser = async (formData: UserFormData) => {
    try {
      await create(formData);
      showSuccess('사용자가 생성되었습니다');
    } catch (error) {
      showError(error instanceof Error ? error.message : '생성에 실패했습니다');
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    editUserModal.open();
  };

  const handleUpdateUser = async (formData: UserFormData) => {
    if (!selectedUser) return;
    try {
      await update(selectedUser.id, formData);
      showSuccess('사용자가 수정되었습니다');
      setSelectedUser(null);
    } catch (error) {
      showError(error instanceof Error ? error.message : '수정에 실패했습니다');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteEntity(id);
      showSuccess('삭제되었습니다');
    } catch (error) {
      showError(error instanceof Error ? error.message : '삭제에 실패했습니다');
    }
  };

  // Handlers - Post
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
    editPostModal.open();
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

  return (
    <div className="container mx-auto p-6">
      <div className="bg-card text-card-foreground rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6">관리 페이지</h1>

        {/* Notifications */}
        {notification.type === 'success' && (
          <Alert className="mb-4 bg-success-light border-success">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertTitle className="text-success">성공</AlertTitle>
            <AlertDescription className="text-success-dark">
              {notification.message}
            </AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={dismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        )}

        {notification.type === 'error' && (
          <Alert className="mb-4 bg-destructive-light border-destructive">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertTitle className="text-destructive">오류</AlertTitle>
            <AlertDescription className="text-destructive-dark">
              {notification.message}
            </AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={dismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        )}

        {/* Entity Type Selector */}
        <UserPostSelector selected={entityType} onSelect={setEntityType} />

        {/* Statistics */}
        <StatisticsCards stats={stats} />

        {/* Create Button */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={entityType === 'user' ? createUserModal.open : createPostModal.open}
          >
            {entityType === 'user' ? '사용자 생성' : '게시글 생성'}
          </Button>
        </div>

        {/* Table */}
        {entityType === 'user' ? (
          <UserTable
            users={data as User[]}
            isLoading={isLoading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        ) : (
          <PostTable
            posts={data as Post[]}
            isLoading={isLoading}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            onPublish={handlePublish}
            onArchive={handleArchive}
            onRestore={handleRestore}
          />
        )}
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={createUserModal.isOpen}
        onClose={createUserModal.close}
        onSubmit={handleCreateUser}
      />

      <CreatePostModal
        isOpen={createPostModal.isOpen}
        onClose={createPostModal.close}
        onSubmit={handleCreatePost}
      />

      <EditUserModal
        isOpen={editUserModal.isOpen}
        onClose={editUserModal.close}
        onSubmit={handleUpdateUser}
        user={selectedUser}
      />

      <EditPostModal
        isOpen={editPostModal.isOpen}
        onClose={editPostModal.close}
        onSubmit={handleUpdatePost}
        post={selectedPost}
      />
    </div>
  );
};
