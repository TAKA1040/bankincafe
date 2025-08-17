import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "./providers/SessionProvider";

export const metadata: Metadata = {
  title: "Banking Cafe",
  description: "Banking management application with secure authentication",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
