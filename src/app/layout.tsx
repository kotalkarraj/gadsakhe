import type { Metadata } from "next";
import {
  Fraunces,
  Inter,
  JetBrains_Mono,
  Tiro_Devanagari_Marathi,
} from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display-google",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-body-google",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-google",
  subsets: ["latin"],
});

const deva = Tiro_Devanagari_Marathi({
  variable: "--font-deva-google",
  subsets: ["devanagari"],
  weight: "400",
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
      className={`${fraunces.variable} ${inter.variable} ${mono.variable} ${deva.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
