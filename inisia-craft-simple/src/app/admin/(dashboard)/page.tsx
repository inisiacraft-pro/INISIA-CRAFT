import { createClient } from '@/lib/supabase/server';

export default async function AdminHome() {
  const supabase = createClient();
  const [{ count: servicesCount }, { count: galleryCount }, { count: newInquiries }] = await Promise.all([
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ]);

  const stats = [
    { label: 'الخدمات المنشورة', value: servicesCount ?? 0, href: '/admin/services' },
    { label: 'صور المعرض', value: galleryCount ?? 0, href: '/admin/gallery' },
    { label: 'رسائل جديدة بانتظار الرد', value: newInquiries ?? 0, href: '/admin/messages' },
  ];

  return (
    <>
      <div className="admin-header">
        <h1 className="sec-title hd" style={{ fontSize: 26 }}>نظرة عامة</h1>
      </div>
      <div className="grid-3">
        {stats.map((s) => (
          <a key={s.label} href={s.href} className="admin-card" style={{ display: 'block' }}>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 32, fontWeight: 700, fontFamily: 'Markazi Text, serif' }}>{s.value}</p>
          </a>
        ))}
      </div>
    </>
  );
}
