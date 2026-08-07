import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Parfums Ramzi — Décants & Parfums de Niche",
    template: "%s | Parfums Ramzi",
  },
  description:
    "Commerce de parfums de niche et de décants 10 ml basé au Québec, Canada. Découvrez des fragrances rares et exclusives.",
  keywords: ["parfum niche", "décants", "Québec", "parfumerie", "fragrances"],
  openGraph: {
    title: "Parfums Ramzi",
    description: "Décants et parfums de niche au Québec",
    locale: "fr_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
