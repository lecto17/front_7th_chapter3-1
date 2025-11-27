import { z } from "zod";

export const postFormSchema = z.object({
  title: z
    .string()
    .min(5, "제목은 5자 이상이어야 합니다")
    .max(100, "제목은 100자 이하여야 합니다"),
  content: z.string().optional(),
  author: z.string().min(1, "작성자는 필수입니다"),
  category: z.union([
    z.literal("development"),
    z.literal("design"),
    z.literal("accessibility"),
  ]),
  status: z.union([
    z.literal("draft"),
    z.literal("published"),
    z.literal("archived"),
  ]),
});

export type PostFormData = z.infer<typeof postFormSchema>;
