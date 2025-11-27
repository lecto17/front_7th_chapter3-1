import { useState } from 'react';
import { useModal } from './useModal';
import { useNotification } from './useNotification';
import type { User } from '@/services/userService';
import type { UserFormData } from '@/schemas/userSchema';

interface UseUserHandlersProps {
  create: (formData: UserFormData) => Promise<void>;
  update: (id: number, formData: UserFormData) => Promise<void>;
  deleteEntity: (id: number) => Promise<void>;
}

export function useUserHandlers({
  create,
  update,
  deleteEntity
}: UseUserHandlersProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const userModal = useModal();
  const { showSuccess, showError } = useNotification();

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
    userModal.open();
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

  const handleCloseUserModal = () => {
    userModal.close();
    setSelectedUser(null);
  };

  return {
    selectedUser,
    userModal,
    handleCreateUser,
    handleEditUser,
    handleUpdateUser,
    handleDeleteUser,
    handleCloseUserModal
  };
}
