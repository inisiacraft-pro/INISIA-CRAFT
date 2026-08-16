import { createClient } from '@/lib/supabase/server';
import { upsertService, deleteService } from '@/app/actions';

export default async function AdminServicesPage() {
  const supabase = createClient();
  const { data: services } = await supabase.from('services').select('*').order('sort_order');

  return (
    <>
      <div className="admin-header">
        <h1 className="sec-title hd" style={{ fontSize: 26 }}>الخدمات</h1>
      </div>

      <div className="admin-card" style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>إضافة خدمة جديدة</h2>
        <form action={upsertService} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
          <input name="title" placeholder="عنوان الخدمة" required />
          <textarea name="description" placeholder="وصف مختصر" rows={3} />
          <input name="price_from" type="number" placeholder="السعر ابتداءً من (دج)" />
          <input name="image_url" placeholder="رابط الصورة (اختياري)" />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input type="checkbox" name="is_active" defaultChecked style={{ width: 'auto' }} />
            مفعّلة وتظهر في الموقع
          </label>
          <button type="submit" className="btn primary">إضافة</button>
        </form>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>العنوان</th>
              <th>السعر</th>
              <th>الحالة</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(services ?? []).map((s) => (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>{s.price_from != null ? `${s.price_from} دج` : '—'}</td>
                <td>
                  <span className={`badge ${s.is_active ? 'done' : 'new'}`}>{s.is_active ? 'مفعّلة' : 'موقوفة'}</span>
                </td>
                <td>
                  <form action={deleteService.bind(null, s.id)}>
                    <button type="submit" className="btn ghost small">حذف</button>
                  </form>
                </td>
              </tr>
            ))}
            {(services ?? []).length === 0 && (
              <tr>
                <td colSpan={4} style={{ color: 'var(--ink-soft)', textAlign: 'center', padding: 20 }}>
                  لا توجد خدمات بعد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
