import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 빌드 시점에 환경 변수가 없을 경우 에러가 발생하여 빌드가 중단되는 것을 방지
    if (!supabaseUrl || !supabaseKey) {
        return createServerClient(
            supabaseUrl || "https://placeholder-url.supabase.co",
            supabaseKey || "placeholder-key",
            {
                cookies: {
                    getAll() { return []; },
                    setAll() { },
                }
            }
        );
    }

    return createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Server Component에서 호출될 경우 무시
                    }
                },
            },
        }
    );
}
