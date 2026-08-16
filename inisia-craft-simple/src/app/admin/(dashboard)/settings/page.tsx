import { createClient } from '@/lib/supabase/server';
import { updateSettings } from '@/app/actions';

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data: s } = await supabase.from('site_settings').select('*').eq('id', 1).single();

  return (
    <>
      <div className="admin-header">
        <h1 className="sec-title hd" style={{ fontSize: 26 }}>إعدادات الموقع</h1>
      </div>

      <form action={updateSettings} className="admin-card" style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>وسائل التواصل</h2>
        <label style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
          البريد الإلكتروني
          <input name="contact_email" defaultValue={s?.contact_email ?? ''} placeholder="contact@example.com" />
        </label>
        <label style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
          رقم واتساب (بصيغة دولية بدون +، مثال 213500000000)
          <input name="whatsapp_number" defaultValue={s?.whatsapp_number ?? ''} />
        </label>
        <label style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
          رابط فيسبوك
          <input name="facebook_url" defaultValue={s?.facebook_url ?? ''} />
        </label>
        <label style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
          رابط إنستغرام
          <input name="instagram_url" defaultValue={s?.instagram_url ?? ''} />
        </label>
        <label style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
          العنوان (اختياري)
          <input name="address" defaultValue={s?.address ?? ''} />
        </label>

        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>نصوص الصفحة الرئيسية</h2>
        <label style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
          عنوان الواجهة الرئيسي
          <input name="hero_title" defaultValue={s?.hero_title ?? ''} />
        </label>
        <label style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
          الوصف الفرعي
          <textarea name="hero_subtitle" defaultValue={s?.hero_subtitle ?? ''} rows={2} />
        </label>
        <label style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
          نص "من نحن"
          <textarea name="about_text" defaultValue={s?.about_text ?? ''} rows={4} />
        </label>

        <button type="submit" className="btn primary">حفظ التغييرات</button>
      </form>
    </>
  );
}
