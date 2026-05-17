import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manga MV Engine",
  description: "BGMと画像で漫画演出MVを作るWebアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
