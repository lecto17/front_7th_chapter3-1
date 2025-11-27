import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postFormSchema, type PostFormData } from "../../schemas/postSchema";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface PostFormProps {
  defaultValues?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => void | Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export const PostForm: React.FC<PostFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "저장",
}) => {
  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: defaultValues || {
      title: "",
      content: "",
      author: "",
      category: "development",
      status: "draft",
    },
  });

  const handleSubmit = async (data: PostFormData) => {
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
        <Label htmlFor="title">
          제목 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          {...form.register("title")}
          placeholder="제목을 입력하세요"
        />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          {...form.register("content")}
          placeholder="내용을 입력하세요"
          rows={4}
        />
        {form.formState.errors.content && (
          <p className="text-sm text-destructive">
            {form.formState.errors.content.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">
          작성자 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="author"
          {...form.register("author")}
          placeholder="작성자를 입력하세요"
        />
        {form.formState.errors.author && (
          <p className="text-sm text-destructive">
            {form.formState.errors.author.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">
          카테고리 <span className="text-destructive">*</span>
        </Label>
        <Select
          value={form.watch("category")}
          onValueChange={(value) =>
            form.setValue("category", value as PostFormData["category"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="카테고리를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="development">개발</SelectItem>
            <SelectItem value="design">디자인</SelectItem>
            <SelectItem value="accessibility">접근성</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.category && (
          <p className="text-sm text-destructive">
            {form.formState.errors.category.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">
          상태 <span className="text-destructive">*</span>
        </Label>
        <Select
          value={form.watch("status")}
          onValueChange={(value) =>
            form.setValue("status", value as PostFormData["status"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="상태를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">임시저장</SelectItem>
            <SelectItem value="published">게시됨</SelectItem>
            <SelectItem value="archived">보관됨</SelectItem>
          </SelectContent>
        </Select>
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
