import { z } from "zod";

export const ExportAccountValidator = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export type ExportAccountCredentials = z.infer<typeof ExportAccountValidator>;
