import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// عميل Supabase من جهة الخادم — يُستخدم في Server Components و Server Actions
// يقرأ جلسة تسجيل الدخول من الكوكيز (HttpOnly تلقائيًا عبر Supabase)
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // يُتجاهل عند الاستدعاء من Server Component بدون كتابة كوكيز (طبيعي في Next.js)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // نفس الملاحظة أعلاه
          }
        },
      },
    }
  );
}

// تتحقق أن المستخدم الحالي هو الأدمن (بريده مطابق لبريد الأدمن الوحيد المُعرَّف كـ Secret)
// حتى لو أنشأ أحدهم حسابًا في Supabase Auth، هذا لا يمنحه صلاحية إدارة — RLS في قاعدة
// البيانات تتحقق من نفس الشرط بشكل مستقل (انظر supabase/schema.sql)
export async function getAdminSession() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
