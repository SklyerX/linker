import { z } from "zod";
import { GroupValidator } from "./group";
import { LinkValidatorWithImage } from "./link";
import { MarkdownValidator } from "./markdown";
import { RedirectUrlValidator } from "./redirectUrl";

export const ImportAccountValidator = z.object({
  GroupedLinks: LinkValidatorWithImage.array().optional(),
  Groups: GroupValidator.array().optional(),
  Links: LinkValidatorWithImage.array().optional(),
  Markdowns: MarkdownValidator.array().optional(),
  Urls: RedirectUrlValidator.array().optional(),
});

export type ImportAccountCredentials = z.infer<typeof ImportAccountValidator>;
