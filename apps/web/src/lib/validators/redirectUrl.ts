import { z } from "zod";

export const RedirectUrlValidator = z.object({
  title: z.string().min(1).max(30),
  active: z.boolean().optional(),
  redirectUrl: z.string().url(),
});

export type RedirectUrlCredentials = z.infer<typeof RedirectUrlValidator>;
