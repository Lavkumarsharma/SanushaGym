import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'FitLocal Gym - Owner Dashboard',
  description: 'Gym member retention and management dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=SF+Pro+Rounded:wght@400;500;600;700;800;900&display=swap"
          rel="preload"
          as="style"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gym-black text-white min-h-full`}>
        {children}
      </body>
    </html>
  );
}
