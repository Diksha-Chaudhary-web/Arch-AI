import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArchFlow AI",
  description: "AI-powered collaborative software architecture workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
