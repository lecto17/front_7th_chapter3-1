import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useEntityManagement } from '@/hooks/useEntityManagement';
import { useUserHandlers } from '@/hooks/useUserHandlers';
import { usePostHandlers } from '@/hooks/usePostHandlers';
import { useNotification } from '@/hooks/useNotification';
import { useEntityStats } from '@/hooks/useEntityStats';
import { StatisticsCards } from '@/components/features/dashboard/StatisticsCards';
import { UserTable } from '@/components/features/users/UserTable';
import { PostTable } from '@/components/features/posts/PostTable';
import { UserModal } from '@/components/features/users/UserModal';
import { PostModal } from '@/components/features/posts/PostModal';
import type { User } from '@/services/userService';
import type { Post } from '@/services/postService';
import '@/styles/components.css';

type EntityType = 'user' | 'post';

export const ManagementPage: React.FC = () => {
  // State
  const [entityType, setEntityType] = useState<EntityType>('post');

  // Hooks
  const { data, isLoading, create, update, deleteEntity } =
    useEntityManagement(entityType);
  const { notification, dismiss } = useNotification();
  const stats = useEntityStats(data, entityType);

  // User Handlers
  const {
    selectedUser,
    userModal,
    handleCreateUser,
    handleEditUser,
    handleUpdateUser,
    handleDeleteUser,
    handleCloseUserModal
  } = useUserHandlers({ create, update, deleteEntity });

  // Post Handlers
  const {
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
  } = usePostHandlers({ create, update, deleteEntity });

  return (
    <div className="min-h-screen bg-[#f0f0f0] dark:bg-background">
      <div className="max-w-[1200px] mx-auto p-5">
        {/* 제목 부분 - 흰색 컨테이너 밖 */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold mb-[5px] text-foreground">
            관리 시스템
          </h1>
          <p className="text-sm text-muted-foreground">
            사용자와 게시글을 관리하세요
          </p>
        </div>

        {/* 흰색 컨테이너 */}
        <div className="bg-card border border-border p-2.5">
          {/* Entity Type Selector (Inlined) */}
          <div
            style={{
              marginBottom: '15px',
              borderBottom: '2px solid #ccc',
              paddingBottom: '5px'
            }}
          >
            <button
              onClick={() => setEntityType('post')}
              style={{
                padding: '8px 16px',
                marginRight: '5px',
                fontSize: '14px',
                fontWeight: entityType === 'post' ? 'bold' : 'normal',
                border: '1px solid #999',
                background: entityType === 'post' ? '#1976d2' : '#f5f5f5',
                color: entityType === 'post' ? 'white' : '#333',
                cursor: 'pointer',
                borderRadius: '3px'
              }}
            >
              게시글
            </button>
            <button
              onClick={() => setEntityType('user')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: entityType === 'user' ? 'bold' : 'normal',
                border: '1px solid #999',
                background: entityType === 'user' ? '#1976d2' : '#f5f5f5',
                color: entityType === 'user' ? 'white' : '#333',
                cursor: 'pointer',
                borderRadius: '3px'
              }}
            >
              사용자
            </button>
          </div>

          {/* Create Button */}
          <div className="flex justify-end mb-4">
            <Button
              onClick={entityType === 'user' ? userModal.open : postModal.open}
            >
              새로 만들기
            </Button>
          </div>

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

          {/* Statistics */}
          <StatisticsCards stats={stats} />

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
        <UserModal
          isOpen={userModal.isOpen}
          onClose={handleCloseUserModal}
          onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
          user={selectedUser}
        />

        <PostModal
          isOpen={postModal.isOpen}
          onClose={handleClosePostModal}
          onSubmit={selectedPost ? handleUpdatePost : handleCreatePost}
          post={selectedPost}
        />
      </div>
    </div>
  );
};
