export default function AboutSection({ text }: { text: string | null }) {
  const about =
    text ||
    'INISIA CRAFT بيت خياطة نسائي يقدّم تصاميم مفصّلة حسب الطلب، بمقاسك الخاص وذوقك الشخصي. نهتم بكل تفصيلة من اختيار القماش إلى اللمسات الأخيرة، لنمنحك قطعة تشبهك.';

  return (
    <section id="about" className="pad">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <span className="sec-eyebrow">من نحن</span>
        <h2 className="sec-title hd" style={{ marginBottom: 18 }}>قصتنا مع الإبرة والخيط</h2>
        <p className="sec-text" style={{ fontSize: 16.5 }}>{about}</p>
      </div>
    </section>
  );
}
