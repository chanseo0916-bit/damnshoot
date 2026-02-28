import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 빌드 시점에 환경 변수가 없을 경우 에러가 발생하여 빌드가 중단되는 것을 방지
    if (!supabaseUrl || !supabaseKey) {
        return createBrowserClient(
            supabaseUrl || "https://placeholder-url.supabase.co",
            supabaseKey || "placeholder-key"
        );
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
}
