import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'INISIA CRAFT — بيت خياطة نسائي حسب الطلب',
  description: 'تصاميم أزياء نسائية حسب الطلب، خياطة وتفصيل بجودة عالية. تصفّحي خدماتنا ومعرض أعمالنا وتواصلي معنا مباشرة.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'INISIA CRAFT',
    description: 'تصاميم أزياء نسائية حسب الطلب — تصميم، تفصيل، وقياسات بدقة.',
    images: ['/logo-lockup.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
