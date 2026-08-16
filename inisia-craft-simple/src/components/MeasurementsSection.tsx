'use client';

import { useState, useTransition } from 'react';
import { estimateMeasurements, EstimateResult, KnownMeasure } from '@/lib/measurementEstimator';
import { submitInquiry } from '@/app/actions';

export default function MeasurementsSection() {
  const [height, setHeight] = useState('');
  const [knownType, setKnownType] = useState<'bust' | 'waist' | 'hips' | 'size'>('bust');
  const [knownValue, setKnownValue] = useState('');
  const [result, setResult] = useState<EstimateResult | null>(null);

  const [name, setName] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const [sendResult, setSendResult] = useState<{ ok: boolean; error?: string } | null>(null);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    const h = Number(height);
    if (!h || h < 120 || h > 210) return;

    const known: KnownMeasure =
      knownType === 'size'
        ? { type: 'size', value: knownValue as 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' }
        : { type: knownType, value: Number(knownValue) };

    setResult(estimateMeasurements(h, known));
    setSendResult(null);
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!result || !name || !contactValue) return;

    const message = [
      'تقدير مقاسات (محسوب تلقائيًا، يُرجى مراجعته قبل التفصيل):',
      `المقاس الدولي الأقرب: ${result.matchedSize}`,
      `الصدر: ${result.bust} سم`,
      `الخصر: ${result.waist} سم`,
      `الأرداف: ${result.hips} سم`,
      `الكتف: ${result.shoulder} سم`,
      `طول الكم: ${result.sleeve_length} سم`,
      `الطول الكلي: ${result.total_length} سم`,
    ].join('\n');

    const formData = new FormData();
    formData.set('name', name);
    formData.set('contact_value', contactValue);
    formData.set('service_interested', 'تقدير مقاسات بالذكاء الاصطناعي');
    formData.set('message', message);

    startTransition(async () => {
      const res = await submitInquiry(formData);
      setSendResult(res);
    });
  }

  return (
    <section id="measurements" className="pad" style={{ background: 'var(--bg-sunken)' }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-eyebrow">قياساتك بدقة</span>
          <h2 className="sec-title hd">قدّري مقاساتك في ثوانٍ</h2>
          <p className="sec-text">
            أدخلي طولك ومقياسًا واحدًا تعرفينه بدقة، وسنقدّر لك بقية المقاسات فورًا بناءً على
            جداول المقاسات الدولية المعتمدة — تقدير رقمي شفاف، تراجعه خياطتنا معك قبل التفصيل النهائي.
          </p>
        </div>

        <div className="contact-grid">
          <form onSubmit={handleCalculate} className="contact-form">
            <label style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
              الطول الكلي (سم)
              <input
                type="number" min={120} max={210} required
                value={height} onChange={(e) => setHeight(e.target.value)}
                placeholder="مثال: 165"
              />
            </label>
            <label style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
              ما الذي تعرفينه بدقة؟
              <select
                value={knownType}
                onChange={(e) => { setKnownType(e.target.value as typeof knownType); setKnownValue(''); }}
              >
                <option value="bust">محيط الصدر (سم)</option>
                <option value="waist">محيط الخصر (سم)</option>
                <option value="hips">محيط الأرداف (سم)</option>
                <option value="size">مقاسي الدولي المعتاد (XS–XXL)</option>
              </select>
            </label>

            {knownType === 'size' ? (
              <label style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
                المقاس
                <select value={knownValue} onChange={(e) => setKnownValue(e.target.value)} required>
                  <option value="" disabled>اختاري</option>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            ) : (
              <label style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
                القيمة (سم)
                <input type="number" required value={knownValue} onChange={(e) => setKnownValue(e.target.value)} />
              </label>
            )}

            <button type="submit" className="btn gold block">احسبي التقدير</button>
          </form>

          <div>
            {!result ? (
              <div className="admin-card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <p className="sec-text">النتيجة ستظهر هنا بعد الحساب.</p>
              </div>
            ) : (
              <div className="admin-card">
                <p style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 14, fontWeight: 700 }}>
                  المقاس الدولي الأقرب: {result.matchedSize}
                </p>
                <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 14, marginBottom: 16, listStyle: 'none' }}>
                  <li>الصدر: <b>{result.bust} سم</b></li>
                  <li>الخصر: <b>{result.waist} سم</b></li>
                  <li>الأرداف: <b>{result.hips} سم</b></li>
                  <li>الكتف: <b>{result.shoulder} سم</b></li>
                  <li>طول الكم: <b>{result.sleeve_length} سم</b></li>
                  <li>الطول الكلي: <b>{result.total_length} سم</b></li>
                </ul>
                <p style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginBottom: 18 }}>
                  هذا تقدير رقمي شفاف مبني على جداول مقاسات دولية ونسب قياسية في رسم الأنماط — وليس نتيجة
                  نموذج غير قابل للتفسير. يُرجى مراجعته مع فريقنا قبل الاعتماد النهائي.
                </p>

                <form onSubmit={handleSend} style={{ display: 'grid', gap: 10, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 600 }}>أرسلي هذا التقدير لنا مباشرة</p>
                  <input placeholder="اسمك" required value={name} onChange={(e) => setName(e.target.value)} />
                  <input placeholder="بريدك أو رقم هاتفك" required value={contactValue} onChange={(e) => setContactValue(e.target.value)} />
                  <button type="submit" className="btn primary block" disabled={isPending}>
                    {isPending ? 'جارٍ الإرسال...' : 'إرسال المقاسات لنا'}
                  </button>
                  {sendResult && (
                    <p className={`form-msg ${sendResult.ok ? 'success' : 'error'}`}>
                      {sendResult.ok ? 'تم إرسال مقاساتك، سنراجعها ونتواصل معك قريبًا.' : sendResult.error}
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
