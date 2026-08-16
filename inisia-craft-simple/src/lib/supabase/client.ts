import { createBrowserClient } from '@supabase/ssr';

// عميل Supabase من جهة المتصفح — يُستخدم فقط في مكونات "use client"
// المفتاح المستخدم هنا هو anon key العام (آمن للنشر) وليس service_role
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
