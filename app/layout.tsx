import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://benia.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "BENIA — Verified Opportunities in Spain & Europe",
    template: "%s | BENIA",
  },

  description:
    "Discover verified referral, fintech, banking, crypto, cashback, business and app opportunities in Spain and Europe.",

  keywords: [
    "referral programs Spain",
    "referidos España",
    "referral bonuses",
    "fintech referrals",
    "bank referrals",
    "crypto referrals",
    "cashback Spain",
    "business referrals",
    "app promotions",
    "verified opportunities",
    "fintech Spain",
    "crypto Europe",
  ],

  applicationName: "BENIA",

  authors: [{ name: "BENIA" }],
  creator: "BENIA",
  publisher: "BENIA",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "BENIA",
    title: "BENIA — Verified Opportunities",
    description:
      "Discover verified referral, fintech, banking, crypto, cashback, business and app opportunities in Spain and Europe.",
  },

  twitter: {
    card: "summary_large_image",
    title: "BENIA — Verified Opportunities",
    description:
      "Discover verified referral, fintech, banking, crypto, cashback, business and app opportunities in Spain and Europe.",
  },

  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
