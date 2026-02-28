import { z } from "zod";

// ============================================================
// Food Validation Schemas
// ============================================================

export const foodCategories = [
    "korean",
    "chinese",
    "japanese",
    "western",
    "fastfood",
    "dessert",
] as const;

export const foodCreateSchema = z.object({
    name: z
        .string()
        .min(1, "음식 이름을 입력해주세요")
        .max(50, "음식 이름은 50자 이내로 입력해주세요"),
    category: z.enum(foodCategories, {
        message: "카테고리를 선택해주세요",
    }),
    description: z.string().max(200, "설명은 200자 이내로 입력해주세요").optional().nullable(),
    image_url: z.string().url("올바른 URL을 입력해주세요").optional().nullable(),
});

export const foodUpdateSchema = foodCreateSchema.partial().extend({
    is_favorite: z.boolean().optional(),
});

export type FoodCreateInput = z.infer<typeof foodCreateSchema>;
export type FoodUpdateInput = z.infer<typeof foodUpdateSchema>;
