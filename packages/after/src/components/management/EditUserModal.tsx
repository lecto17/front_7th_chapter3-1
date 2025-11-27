import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { UserForm } from "./UserForm";
import type { UserFormData } from "../../schemas/userSchema";
import type { User } from "../../services/userService";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void | Promise<void>;
  user: User | null;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
}) => {
  const handleSubmit = async (data: UserFormData) => {
    await onSubmit(data);
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>사용자 수정</DialogTitle>
        </DialogHeader>
        <UserForm
          defaultValues={{
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="수정 완료"
        />
      </DialogContent>
    </Dialog>
  );
};
