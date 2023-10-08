import { z } from "zod";

export const DeleteAccountValidator = z.object({
  confirmation: z.string(),
});

export type DeleteAccountCredentials = z.infer<typeof DeleteAccountValidator>;
