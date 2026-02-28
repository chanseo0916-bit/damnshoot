"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { foodCreateSchema, type FoodCreateInput } from "@/lib/validations/food";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CATEGORY_MAP } from "@/types/database";
import type { Food } from "@/types/database";

interface FoodFormProps {
    initialData?: Food;
    onSubmit: (data: FoodCreateInput) => void;
    isLoading?: boolean;
    submitLabel?: string;
}

const categoryOptions = Object.entries(CATEGORY_MAP).map(([value, meta]) => ({
    value,
    label: `${meta.emoji} ${meta.label}`,
}));

export function FoodForm({
    initialData,
    onSubmit,
    isLoading,
    submitLabel = "저장",
}: FoodFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FoodCreateInput>({
        resolver: zodResolver(foodCreateSchema),
        defaultValues: {
            name: initialData?.name || "",
            category: initialData?.category || undefined,
            description: initialData?.description || "",
        },
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
            <Input
                label="음식 이름"
                placeholder="예: 김치찌개, 파스타, 초밥"
                error={errors.name?.message}
                {...register("name")}
            />
            <Select
                label="카테고리"
                placeholder="카테고리 선택"
                options={categoryOptions}
                error={errors.category?.message}
                {...register("category")}
            />
            <Input
                label="설명 (선택)"
                placeholder="간단한 메모"
                error={errors.description?.message}
                {...register("description")}
            />
            <Button type="submit" isLoading={isLoading} size="lg">
                {submitLabel}
            </Button>
        </form>
    );
}
