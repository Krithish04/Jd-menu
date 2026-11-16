import { z } from "zod";

export const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const categorySchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  nameEn: z.string().min(1, "English name is required"),
  nameGu: z.string().optional().nullable(),
  shortNameEn: z.string().optional().nullable(),
  shortNameGu: z.string().optional().nullable(),
  groupEn: z.string().optional().nullable(),
  groupGu: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  noteGu: z.string().optional().nullable(),
  kind: z.enum(["list", "combo"]).default("list"),
  iconKey: z.string().optional().nullable(),
  visible: z.boolean().default(true),
  sort: z.number().int().optional(),
});

export const itemSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  nameEn: z.string().min(1, "English name is required"),
  nameGu: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionGu: z.string().optional().nullable(),
  price: z.number().int().min(0, "Price must be a positive integer"),
  imageUrl: z.string().optional().nullable(),
  badge: z.enum(["SPECIAL", "POPULAR", "NEW"]).optional().nullable(),
  isVeg: z.boolean().default(true),
  available: z.boolean().default(true),
  visible: z.boolean().default(true),
  sort: z.number().int().optional(),
});

export const reorderSchema = z.object({
  type: z.enum(["category", "item"]),
  ids: z.array(z.string()).min(1),
});

export const settingsSchema = z.object({
  name: z.string().min(1).optional(),
  tagline: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  mobile: z.string().optional().nullable(),
  banner: z.string().optional().nullable(),
  siteUrl: z.string().optional().nullable(),
  showBothLanguages: z.boolean().optional(),
  notices: z
    .array(
      z.object({
        id: z.string().optional(),
        textEn: z.string().min(1),
        textGu: z.string().optional().nullable(),
      })
    )
    .optional(),
});
