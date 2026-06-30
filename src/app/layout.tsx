import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-body-google",
  subsets: ["latin"],
});

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
    <html
      lang="en"
      className={`${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
