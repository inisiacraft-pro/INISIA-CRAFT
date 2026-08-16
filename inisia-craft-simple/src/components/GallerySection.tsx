type GalleryItem = {
  id: string;
  image_url: string;
  caption: string | null;
};

export default function GallerySection({ items }: { items: GalleryItem[] }) {
  return (
    <section id="gallery" className="pad">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-eyebrow">معرض الأعمال</span>
          <h2 className="sec-title hd">من إبداعاتنا</h2>
          <p className="sec-text">لمحة من التصاميم والقطع التي أنجزناها لزبوناتنا.</p>
        </div>

        {items.length === 0 ? (
          <p className="sec-text">سيتم إضافة صور المعرض قريبًا.</p>
        ) : (
          <div className="grid-4">
            {items.map((g) => (
              <div
                key={g.id}
                className="gallery-item"
                style={{ backgroundImage: `url(${g.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                title={g.caption ?? undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
