# النشر — Vercel أو Netlify (مجانًا بالكامل)

الموقع جاهز للنشر بدون أي إعداد إضافي — ملفا `vercel.json` و `netlify.toml` مُجهّزان مسبقًا داخل المشروع.

## الخطوة المشتركة أولًا: Supabase

1. أنشئي مشروعًا في [supabase.com](https://supabase.com) (مجاني).
2. من **SQL Editor**، نفّذي محتوى `supabase/schema.sql` كاملًا.
3. من **Authentication → Users → Add user**، أنشئي حساب الأدمن (بريد + كلمة مرور قوية).
4. انسخي الـ `UUID` الخاص بالحساب، ثم نفّذي في **SQL Editor**:
   ```sql
   insert into admins (user_id) values ('UUID-هنا');
   ```
5. من **Project Settings → API**، انسخي `Project URL` و `anon public key` — ستحتاجينهما في الخطوة التالية.

---

## الخيار 1: Vercel (الأسهل لمشاريع Next.js)

1. ارفعي مجلد المشروع إلى مستودع GitHub (أو GitLab/Bitbucket).
2. ادخلي إلى [vercel.com](https://vercel.com) → **Add New Project** → اختاري المستودع.
3. Vercel يكتشف Next.js تلقائيًا (بفضل `vercel.json`) — لا حاجة لأي إعداد يدوي.
4. أضيفي متغيرات البيئة (**Environment Variables**):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. اضغطي **Deploy**. الموقع سيكون جاهزًا على `https://your-project.vercel.app` مع HTTPS تلقائي خلال دقائق.
6. (اختياري) اربطي دومينك الخاص من **Settings → Domains**.

## الخيار 2: Netlify

1. ارفعي المشروع إلى GitHub (أو استخدمي السحب المباشر لمجلد بعد `npm run build`).
2. ادخلي إلى [netlify.com](https://netlify.com) → **Add new site → Import an existing project**.
3. اختاري المستودع — Netlify سيقرأ `netlify.toml` تلقائيًا (يضبط الأمر `next build` وملحق Next.js).
4. أضيفي متغيرات البيئة من **Site configuration → Environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. اضغطي **Deploy site**. الموقع سيكون جاهزًا على `https://your-project.netlify.app` مع HTTPS تلقائي.
6. (اختياري) اربطي دومينك الخاص من **Domain management**.

---

لا حاجة لأي خادم إضافي (backend) أو إعداد بريد إلكتروني على أي من المنصتين — كل شيء يعمل عبر Supabase مباشرة. أي تعديل تنشرينه لاحقًا (تغيير كود) يُنشر تلقائيًا عند رفعه إلى المستودع.
