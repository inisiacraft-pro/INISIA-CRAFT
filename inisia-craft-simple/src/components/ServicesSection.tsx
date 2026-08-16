type Service = {
  id: string;
  title: string;
  description: string | null;
  price_from: number | null;
  image_url: string | null;
};

export default function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section id="services" className="pad">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-eyebrow">خدماتنا</span>
          <h2 className="sec-title hd">كل ما تحتاجينه لإطلالتك المثالية</h2>
          <p className="sec-text">تصفّحي خدماتنا، واختاري ما يناسبك — ثم تواصلي معنا مباشرة لمناقشة التفاصيل.</p>
        </div>

        {services.length === 0 ? (
          <p className="sec-text">لا توجد خدمات مضافة بعد.</p>
        ) : (
          <div className="grid-3">
            {services.map((s) => (
              <div key={s.id} className="service-card">
                <div
                  className="img"
                  style={s.image_url ? { backgroundImage: `url(${s.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                />
                <div className="body">
                  <h3>{s.title}</h3>
                  {s.description && <p>{s.description}</p>}
                  {s.price_from != null && (
                    <span className="service-price">ابتداءً من {s.price_from.toLocaleString('ar-DZ')} دج</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
