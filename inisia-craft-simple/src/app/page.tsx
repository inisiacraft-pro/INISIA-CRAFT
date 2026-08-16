import { createClient } from '@/lib/supabase/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import MeasurementsSection from '@/components/MeasurementsSection';
import GallerySection from '@/components/GallerySection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export const revalidate = 60; // تحديث المحتوى كل دقيقة — كافٍ لموقع تعريفي، لا حاجة لـ SSR في كل طلب

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: services }, { data: gallery }, { data: settings }] = await Promise.all([
    supabase.from('services').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('gallery_items').select('*').order('sort_order'),
    supabase.from('site_settings').select('*').eq('id', 1).single(),
  ]);

  return (
    <>
      <Header />
      <Hero settings={settings} />
      <ServicesSection services={services ?? []} />
      <MeasurementsSection />
      <GallerySection items={gallery ?? []} />
      <AboutSection text={settings?.about_text ?? null} />
      <ContactSection settings={settings} />
      <Footer />
    </>
  );
}
