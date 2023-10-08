import { z } from "zod";

export const ExportAccountValidatorBody = z.object({
  data: z.string(),
});

export const ExportAccountValidator = z.object({
  initiatedOn: z.date().or(z.string()),
  userId: z.string().min(24).max(24),
  selectedItems: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});

export type ExportAccountCredentials = z.infer<typeof ExportAccountValidator>;
