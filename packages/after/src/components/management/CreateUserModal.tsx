import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { UserForm } from "./UserForm";
import type { UserFormData } from "../../schemas/userSchema";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void | Promise<void>;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = async (data: UserFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>사용자 생성</DialogTitle>
        </DialogHeader>
        <UserForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="생성"
        />
      </DialogContent>
    </Dialog>
  );
};
