import { createClient } from '@/lib/supabase/server';
import { updateInquiryStatus, deleteInquiry } from '@/app/actions';

const statusLabel: Record<string, string> = { new: 'جديدة', contacted: 'تم التواصل', done: 'مكتملة' };

export default async function AdminMessagesPage() {
  const supabase = createClient();
  const { data: inquiries } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });

  return (
    <>
      <div className="admin-header">
        <h1 className="sec-title hd" style={{ fontSize: 26 }}>رسائل الزوار</h1>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {(inquiries ?? []).map((m) => (
          <div key={m.id} className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
              <div>
                <strong>{m.name}</strong>
                <span style={{ color: 'var(--ink-soft)', fontSize: 13.5, marginRight: 10 }}>{m.contact_value}</span>
              </div>
              <span className={`badge ${m.status}`}>{statusLabel[m.status]}</span>
            </div>
            {m.service_interested && (
              <p style={{ fontSize: 13.5, color: 'var(--accent)', marginBottom: 6 }}>الخدمة: {m.service_interested}</p>
            )}
            <p style={{ fontSize: 14.5, marginBottom: 14 }}>{m.message}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <form action={updateInquiryStatus.bind(null, m.id, 'contacted')}>
                <button type="submit" className="btn ghost small">تم التواصل</button>
              </form>
              <form action={updateInquiryStatus.bind(null, m.id, 'done')}>
                <button type="submit" className="btn ghost small">إنهاء</button>
              </form>
              <form action={deleteInquiry.bind(null, m.id)}>
                <button type="submit" className="btn ghost small">حذف</button>
              </form>
            </div>
          </div>
        ))}
        {(inquiries ?? []).length === 0 && (
          <p style={{ color: 'var(--ink-soft)' }}>لا توجد رسائل بعد.</p>
        )}
      </div>
    </>
  );
}
