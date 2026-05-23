import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'ZoomCall – Video Calls & Conferencing',
  description:
    'Professional video conferencing app. Start instant meetings, schedule sessions, and collaborate with your team.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <div className="flex pt-14">
          <Sidebar />
          {/* Contenido principal desplazado por el sidebar */}
          <main className="flex-1 ml-[220px] min-h-[calc(100vh-56px)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
