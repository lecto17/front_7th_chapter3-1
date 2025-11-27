import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema, type UserFormData } from "../../schemas/userSchema";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import { Button } from "../ui/button";

interface UserFormProps {
  defaultValues?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void | Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export const UserForm: React.FC<UserFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "저장",
}) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultValues || {
      username: "",
      email: "",
      role: "user",
      status: "active",
    },
  });

  const handleSubmit = async (data: UserFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      // Error handled by parent
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">
          사용자명 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="username"
          {...form.register("username")}
          placeholder="사용자명을 입력하세요"
        />
        {form.formState.errors.username && (
          <p className="text-sm text-destructive">
            {form.formState.errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          이메일 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          placeholder="이메일을 입력하세요"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">
          역할 <span className="text-destructive">*</span>
        </Label>
        <NativeSelect id="role" {...form.register("role")}>
          <NativeSelectOption value="">역할을 선택하세요</NativeSelectOption>
          <NativeSelectOption value="user">사용자</NativeSelectOption>
          <NativeSelectOption value="moderator">운영자</NativeSelectOption>
          <NativeSelectOption value="admin">관리자</NativeSelectOption>
        </NativeSelect>
        {form.formState.errors.role && (
          <p className="text-sm text-destructive">
            {form.formState.errors.role.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">
          상태 <span className="text-destructive">*</span>
        </Label>
        <NativeSelect id="status" {...form.register("status")}>
          <NativeSelectOption value="">상태를 선택하세요</NativeSelectOption>
          <NativeSelectOption value="active">활성</NativeSelectOption>
          <NativeSelectOption value="inactive">비활성</NativeSelectOption>
          <NativeSelectOption value="suspended">정지</NativeSelectOption>
        </NativeSelect>
        {form.formState.errors.status && (
          <p className="text-sm text-destructive">
            {form.formState.errors.status.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "저장 중..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};
