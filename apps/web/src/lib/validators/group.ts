import { z } from "zod";

export const GroupValidator = z.object({
  groupName: z.string().min(1).max(128),
});

export type GroupCredentials = z.infer<typeof GroupValidator>;
