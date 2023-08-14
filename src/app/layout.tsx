import Header from '@/components/Header';
import './globals.css';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import AuthProvider from '@/components/AuthProvider';

const sans = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // max-w-screen-2xl mx-auto
  return (
    <html lang="en" className={sans.className}>
      <body className="flex flex-col w-full justify-center bg-zinc-100 ">
        <AuthProvider>
          <>
            <div className="bg-white w-full border-b border-b-zinc-300">
              <Header />
            </div>
            <main className=" w-full p-2">
              <div className="max-w-screen-2xl mx-auto ">{children}</div>
            </main>
          </>
        </AuthProvider>
      </body>
    </html>
  );
}
