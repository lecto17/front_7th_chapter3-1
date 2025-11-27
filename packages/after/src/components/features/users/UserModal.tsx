import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { UserForm } from './UserForm';
import type { UserFormData } from '@/schemas/userSchema';
import type { User } from '@/services/userService';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void | Promise<void>;
  user?: User | null; // If provided, it's in Edit mode
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user
}) => {
  const isEditMode = !!user;

  const handleSubmit = async (data: UserFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? '사용자 수정' : '사용자 생성'}
          </DialogTitle>
        </DialogHeader>
        <UserForm
          defaultValues={
            user
              ? {
                  username: user.username,
                  email: user.email,
                  role: user.role,
                  status: user.status
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
