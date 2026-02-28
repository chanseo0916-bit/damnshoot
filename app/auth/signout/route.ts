import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function POST() {
    const supabase = await createClient();
    await supabase.auth.signOut();

    // 로그아웃 시 관련 캐시 무효화 및 홈페이지로 리다이렉트
    revalidatePath("/", "layout");
    redirect("/");
}
