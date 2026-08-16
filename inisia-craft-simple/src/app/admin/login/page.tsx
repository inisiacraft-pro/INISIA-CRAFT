'use client';

import { useState, useTransition } from 'react';
import { adminSignIn } from '@/app/actions';

export default function AdminLoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await adminSignIn(formData);
      if (res && !res.ok) setError(res.error || 'حدث خطأ.');
    });
  }

  return (
    <div className="login-shell">
      <form action={handleSubmit} className="login-card">
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="INISIA CRAFT" style={{ height: 50, margin: '0 auto' }} />
          <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, marginTop: 10 }}>لوحة الإدارة</p>
        </div>
        <input name="email" type="email" placeholder="البريد الإلكتروني" required autoComplete="username" />
        <input name="password" type="password" placeholder="كلمة المرور" required autoComplete="current-password" />
        <button type="submit" className="btn primary block" disabled={isPending}>
          {isPending ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
        </button>
        {error && <p className="form-msg error">{error}</p>}
      </form>
    </div>
  );
}
