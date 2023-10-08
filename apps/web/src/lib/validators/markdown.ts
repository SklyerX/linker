import { z } from "zod";

export const MarkdownValidator = z.object({
  title: z.string().min(3).max(128),
  content: z.any(),
});

export const MarkdownValidatorForm = z.object({
  title: z.string().min(3).max(128),
  content: z.any(),
});

export type MarkdownCredentials = z.infer<typeof MarkdownValidator>;
export type MarkdownCredentialsForm = z.infer<typeof MarkdownValidatorForm>;
