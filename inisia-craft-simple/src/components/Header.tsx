export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap hd-row">
        <a href="/" className="brand-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="INISIA CRAFT" />
        </a>
        <nav className="main-nav">
          <a href="#services">خدماتنا</a>
          <a href="#measurements">قياساتك بدقة</a>
          <a href="#gallery">معرض الأعمال</a>
          <a href="#about">من نحن</a>
          <a href="#contact">تواصلي معنا</a>
        </nav>
        <a href="#contact" className="btn primary small">اطلبي تصميمك</a>
      </div>
    </header>
  );
}
