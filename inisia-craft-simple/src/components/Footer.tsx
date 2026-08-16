export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="INISIA CRAFT" style={{ height: 34, width: 'auto' }} />
        <p style={{ color: 'var(--ink-soft)', fontSize: 13.5 }}>
          © {year} INISIA CRAFT — جميع الحقوق محفوظة
        </p>
        <div className="footer-links">
          <a href="#services" style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>خدماتنا</a>
          <a href="#contact" style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>تواصلي معنا</a>
        </div>
      </div>
    </footer>
  );
}
