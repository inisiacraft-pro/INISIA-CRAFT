import { createClient } from '@/lib/supabase/server';
import { upsertGalleryItem, deleteGalleryItem } from '@/app/actions';

export default async function AdminGalleryPage() {
  const supabase = createClient();
  const { data: items } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false });

  return (
    <>
      <div className="admin-header">
        <h1 className="sec-title hd" style={{ fontSize: 26 }}>معرض الأعمال</h1>
      </div>

      <div className="admin-card" style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>إضافة صورة</h2>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 12 }}>
          ارفعي الصورة إلى Supabase Storage أولًا (Bucket: gallery) ثم الصقي رابطها هنا.
        </p>
        <form action={upsertGalleryItem} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
          <input name="image_url" placeholder="رابط الصورة" required />
          <input name="caption" placeholder="وصف مختصر (اختياري)" />
          <button type="submit" className="btn primary">إضافة</button>
        </form>
      </div>

      <div className="grid-4">
        {(items ?? []).map((g) => (
          <div key={g.id} className="admin-card" style={{ padding: 10 }}>
            <div
              className="gallery-item"
              style={{ backgroundImage: `url(${g.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 8 }}
            />
            <form action={deleteGalleryItem.bind(null, g.id)}>
              <button type="submit" className="btn ghost small block">حذف</button>
            </form>
          </div>
        ))}
        {(items ?? []).length === 0 && (
          <p style={{ color: 'var(--ink-soft)' }}>لا توجد صور بعد.</p>
        )}
      </div>
    </>
  );
}
