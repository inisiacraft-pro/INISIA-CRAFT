'use client';

import { useState, useTransition } from 'react';
import { submitInquiry } from '@/app/actions';

type Settings = {
  whatsapp_number: string | null;
  contact_email: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
};

export default function ContactSection({ settings }: { settings: Settings | null }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitInquiry(formData);
      setResult(res);
    });
  }

  const links = [
    settings?.contact_email && {
      label: 'راسلينا عبر البريد الإلكتروني',
      href: `mailto:${settings.contact_email}`,
      icon: '✉️',
    },
    settings?.whatsapp_number && {
      label: 'تواصلي عبر واتساب',
      href: `https://wa.me/${settings.whatsapp_number}`,
      icon: '📱',
    },
    settings?.facebook_url && { label: 'صفحتنا على فيسبوك', href: settings.facebook_url, icon: '👍' },
    settings?.instagram_url && { label: 'صفحتنا على إنستغرام', href: settings.instagram_url, icon: '📷' },
  ].filter(Boolean) as { label: string; href: string; icon: string }[];

  return (
    <section id="contact" className="pad" style={{ background: 'var(--bg-sunken)' }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-eyebrow">تواصلي معنا</span>
          <h2 className="sec-title hd">لنبدأ في تصميم قطعتك</h2>
          <p className="sec-text">اختاري الطريقة الأنسب لك — تواصل مباشر، أو اتركي رسالة وسنعاود الاتصال بك.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-links">
            {links.length === 0 && (
              <p className="sec-text">سيتم إضافة وسائل التواصل قريبًا.</p>
            )}
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="contact-link">
                <span className="ic">{l.icon}</span>
                <span>{l.label}</span>
              </a>
            ))}
          </div>

          <form action={handleSubmit} className="contact-form">
            <input name="name" placeholder="اسمك الكامل" required maxLength={100} />
            <input name="contact_value" placeholder="بريدك الإلكتروني أو رقم هاتفك" required maxLength={150} />
            <input name="service_interested" placeholder="الخدمة التي تهمك (اختياري)" maxLength={150} />
            <textarea name="message" placeholder="اكتبي تفاصيل طلبك..." rows={4} required maxLength={2000} />
            <button type="submit" className="btn primary block" disabled={isPending}>
              {isPending ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}
            </button>
            {result && (
              <p className={`form-msg ${result.ok ? 'success' : 'error'}`}>
                {result.ok ? 'تم استلام رسالتك، سنتواصل معك قريبًا. شكرًا لك.' : result.error}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
