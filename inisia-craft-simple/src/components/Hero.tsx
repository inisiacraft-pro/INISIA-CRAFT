type Settings = {
  hero_title: string | null;
  hero_subtitle: string | null;
};

export default function Hero({ settings }: { settings: Settings | null }) {
  const title = settings?.hero_title || 'أزياء نسائية <em>حسب الطلب</em>، بلمسة فاخرة';
  const subtitle =
    settings?.hero_subtitle ||
    'من الفكرة إلى القطعة النهائية — تصميم وتفصيل مضبوط على مقاسك، بخيوط جودة وتفاصيل تُصنع بعناية.';

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">بيت خياطة جزائري</span>
          <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: title }} />
          <p className="sec-text" style={{ maxWidth: 480 }}>{subtitle}</p>
          <div className="hero-actions">
            <a href="#contact" className="btn primary">تواصلي معنا الآن</a>
            <a href="#gallery" className="btn ghost">شاهدي أعمالنا</a>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-craft.jpg" alt="من ورشة INISIA CRAFT" className="hero-media" />
      </div>
    </section>
  );
}
