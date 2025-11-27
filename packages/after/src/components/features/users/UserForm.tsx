import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema, type UserFormData } from '@/schemas/userSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption
} from '@/components/ui/native-select';
import { Button } from '@/components/ui/button';

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
  submitLabel = '저장'
}) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultValues || {
      username: '',
      email: '',
      role: 'user',
      status: 'active'
    }
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                사용자명 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="사용자명을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                이메일 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="이메일을 입력하세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                역할 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <NativeSelect {...field}>
                  <NativeSelectOption value="">
                    역할을 선택하세요
                  </NativeSelectOption>
                  <NativeSelectOption value="user">사용자</NativeSelectOption>
                  <NativeSelectOption value="moderator">
                    운영자
                  </NativeSelectOption>
                  <NativeSelectOption value="admin">관리자</NativeSelectOption>
                </NativeSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                상태 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <NativeSelect {...field}>
                  <NativeSelectOption value="">
                    상태를 선택하세요
                  </NativeSelectOption>
                  <NativeSelectOption value="active">활성</NativeSelectOption>
                  <NativeSelectOption value="inactive">
                    비활성
                  </NativeSelectOption>
                  <NativeSelectOption value="suspended">
                    정지
                  </NativeSelectOption>
                </NativeSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? '저장 중...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};
