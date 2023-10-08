import { z } from "zod";

export const LinkValidator = z.object({
  title: z.string().min(1).max(256).optional(),
  url: z.string().url(),
  description: z.string().max(1024).optional(),
});

export const LinkValidatorWithImage = z.object({
  title: z.string().min(1).max(256).optional(),
  url: z.string().url(),
  description: z.string().max(1024).optional().nullable(),
  image: z.string(),
});

export const LinkValidatorForm = z.object({
  title: z.string().min(1).max(256).optional(),
  url: z.string().url(),
  description: z.string().max(1024).optional(),
});

export const GroupLinkValidator = z.object({
  links: z.array(
    z.object({
      title: z.string().min(1).max(256).optional(),
      url: z.string().url(),
      description: z.string().max(1024).optional(),
    })
  ),
});

export const TabsGroupValidator = z.object({
  groupName: z.string().max(128),
  links: z.array(
    z.object({
      title: z.string().min(1).max(256).optional(),
      url: z.string().url(),
      icon: z.string().optional(),
    })
  ),
});

export type LinkCredentials = z.infer<typeof LinkValidator>;
export type LinkCredentialsForm = z.infer<typeof LinkValidatorForm>;
export type GroupLinkCredentials = z.infer<typeof GroupLinkValidator>;
export type TabsGroupCredentials = z.infer<typeof TabsGroupValidator>;
