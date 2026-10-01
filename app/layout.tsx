import React from 'react';

export const metadata = {
  title: 'DARBAR - Fine Dining & Family Restaurant | Authentic Flavours',
  description: 'Authentic North Indian curries, clay tandoor specials, dum biryanis, and AC private family cabins. Order online for doorstep delivery or reserve your table.',
  openGraph: {
    title: 'DARBAR - Fine Dining & Family Restaurant',
    description: 'Authentic flavours & royal family dining experience. Order online or reserve private cabins.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#faf8f5] text-stone-900 antialiased selection:bg-amber-400 selection:text-stone-950 min-h-screen">
        {children}
      </body>
    </html>
  );
}
