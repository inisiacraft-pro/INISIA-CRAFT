import { adminSignOut } from '@/app/actions';

const links = [
  { href: '/admin', label: 'نظرة عامة', icon: '🏠' },
  { href: '/admin/services', label: 'الخدمات', icon: '✂️' },
  { href: '/admin/gallery', label: 'معرض الأعمال', icon: '🖼️' },
  { href: '/admin/messages', label: 'رسائل الزوار', icon: '✉️' },
  { href: '/admin/settings', label: 'إعدادات الموقع', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="logo">INISIA<span>.</span>CRAFT</a>
        <nav className="admin-nav">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              <span>{l.icon}</span> {l.label}
            </a>
          ))}
        </nav>
        <form action={adminSignOut} style={{ marginTop: 32 }}>
          <button type="submit" className="btn ghost small block" style={{ color: '#fff', borderColor: 'rgba(251,247,240,.3)' }}>
            تسجيل الخروج
          </button>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
