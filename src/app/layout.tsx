import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ArchMotion Studio - YouTube Animation Suite',
  description: 'Visual motion and technical animation studio for YouTube content creators.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Caveat:wght@400;700&family=Fira+Code:wght@400;600&family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;600;800&family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=Poppins:wght@400;600;700;800;900&family=Space+Grotesk:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-studio-bg text-slate-100 font-sans antialiased overflow-hidden select-none"
      >
        {children}
      </body>
    </html>
  );
}
