import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gadsakhe — trek stories from the Sahyadris",
  description:
    "Gadsakhe is a journal of fort treks, trails, and monsoon stories from the Sahyadris.",
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
