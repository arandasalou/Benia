import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://benia.es";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "BENIA — Oportunidades verificadas en España y Europa",
    template: "%s | BENIA",
  },

  description:
    "Descubre oportunidades verificadas de fintech, bancos, crypto, cashback, apps y business en España y Europa.",

  keywords: [
    "oportunidades",
    "referidos",
    "referidos España",
    "programas de referidos",
    "bonos",
    "fintech",
    "bancos",
    "crypto",
    "cashback",
    "business",
    "apps",
    "ofertas",
    "promociones",
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
    locale: "es_ES",
    url: siteUrl,
    siteName: "BENIA",
    title: "BENIA — Oportunidades verificadas",
    description:
      "Descubre oportunidades verificadas de fintech, bancos, crypto, cashback, apps y business en España y Europa.",
  },

  twitter: {
    card: "summary_large_image",
    title: "BENIA — Oportunidades verificadas",
    description:
      "Descubre oportunidades verificadas de fintech, bancos, crypto, cashback, apps y business en España y Europa.",
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
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
