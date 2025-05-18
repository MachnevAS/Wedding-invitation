
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Свадебное Приглашение: Артём и Евгения',
  description: 'Приглашение на свадьбу Артёма и Евгении',
};

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&family=Unbounded:wght@700;900&display=swap" rel="stylesheet" />
        {siteKey && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="font-sans antialiased"> {/* Default font set to Montserrat via tailwind config */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
