import { z } from "zod";

export const userFormSchema = z.object({
  username: z
    .string()
    .min(3, "사용자명은 3자 이상이어야 합니다")
    .max(20, "사용자명은 20자 이하여야 합니다")
    .regex(/^[a-zA-Z0-9_]+$/, "영문, 숫자, 언더스코어만 사용 가능합니다"),
  email: z.string().email("올바른 이메일 형식이 아닙니다"),
  role: z.union([
    z.literal("admin"),
    z.literal("moderator"),
    z.literal("user"),
  ]),
  status: z.union([
    z.literal("active"),
    z.literal("inactive"),
    z.literal("suspended"),
  ]),
});

export type UserFormData = z.infer<typeof userFormSchema>;
