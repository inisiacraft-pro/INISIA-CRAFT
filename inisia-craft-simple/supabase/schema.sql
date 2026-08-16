-- ============================================================
-- INISIA CRAFT — قاعدة بيانات مبسطة (بدون حسابات زبائن)
-- 4 جداول فقط. الحماية مفروضة داخل قاعدة البيانات (RLS) وليس
-- فقط في كود الواجهة — حتى لو حدث خطأ برمجي مستقبلي، هذه
-- القواعد تبقى قائمة.
-- ============================================================

-- جدول الأدمن المسموح لهم بالإدارة (يبدأ بحساب واحد، قابل للتوسعة لاحقًا)
create table admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- دالة مساعدة: هل المستخدم الحالي أدمن؟ (تُستخدم داخل كل سياسة RLS)
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ------------------------------------------------------------
-- الخدمات (تُعرض في الصفحة الرئيسية)
-- ------------------------------------------------------------
create table services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price_from numeric,
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table services enable row level security;

create policy "الكل يشاهد الخدمات المفعّلة"
  on services for select
  using (is_active = true or is_admin());

create policy "الأدمن فقط يعدّل الخدمات"
  on services for all
  using (is_admin())
  with check (is_admin());

-- ------------------------------------------------------------
-- معرض الأعمال
-- ------------------------------------------------------------
create table gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table gallery_items enable row level security;

create policy "الكل يشاهد المعرض"
  on gallery_items for select
  using (true);

create policy "الأدمن فقط يعدّل المعرض"
  on gallery_items for all
  using (is_admin())
  with check (is_admin());

-- ------------------------------------------------------------
-- إعدادات الموقع (سطر واحد فقط: روابط تواصل، نصوص الصفحة الرئيسية)
-- لا يوجد أي مفتاح سري هنا (لا مفاتيح API) — كل القيم آمنة للعرض العام
-- ------------------------------------------------------------
create table site_settings (
  id int primary key default 1,
  whatsapp_number text,
  contact_email text,
  facebook_url text,
  instagram_url text,
  address text,
  hero_title text,
  hero_subtitle text,
  about_text text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into site_settings (id) values (1);

alter table site_settings enable row level security;

create policy "الكل يشاهد إعدادات الموقع"
  on site_settings for select
  using (true);

create policy "الأدمن فقط يعدّل الإعدادات"
  on site_settings for update
  using (is_admin())
  with check (is_admin());

-- ------------------------------------------------------------
-- رسائل/طلبات الزوار (بدون أي حساب — أي زائر يمكنه الإرسال فقط)
-- ملاحظة أمان: الزائر يملك صلاحية INSERT فقط — لا يستطيع أبدًا قراءة
-- رسائل غيره أو تعديل/حذف أي رسالة، حتى برسالته هو. فقط الأدمن يقرأ ويدير.
-- ------------------------------------------------------------
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_value text not null,      -- بريد إلكتروني أو رقم واتساب يكتبه الزائر بنفسه
  service_interested text,
  message text not null,
  status text not null default 'new' check (status in ('new','contacted','done')),
  created_at timestamptz not null default now()
);

alter table inquiries enable row level security;

create policy "أي زائر يمكنه إرسال رسالة"
  on inquiries for insert
  with check (true);

create policy "الأدمن فقط يقرأ الرسائل"
  on inquiries for select
  using (is_admin());

create policy "الأدمن فقط يحدّث حالة الرسائل"
  on inquiries for update
  using (is_admin())
  with check (is_admin());

create policy "الأدمن فقط يحذف الرسائل"
  on inquiries for delete
  using (is_admin());

-- ============================================================
-- خطوة بعد التشغيل (مرة واحدة فقط، يدويًا من لوحة Supabase):
-- 1) أنشئي حسابك كأدمن من Authentication > Users > Add user
--    (بريد إلكتروني + كلمة مرور قوية)
-- 2) انسخي الـ UUID الخاص بالحساب من نفس الصفحة
-- 3) نفّذي: insert into admins (user_id) values ('UUID-هنا');
-- بهذا فقط هذا الحساب يملك صلاحية الإدارة — أي حساب آخر (لو أُنشئ
-- بالخطأ أو عبر ثغرة) يبقى بدون أي صلاحية لأنه غير موجود في جدول admins.
-- ============================================================
