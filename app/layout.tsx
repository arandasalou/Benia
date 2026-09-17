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
    "Descubre oportunidades verificadas de referidos, fintech, banca, crypto, cashback, apps y servicios en España y Europa.",

  keywords: [
    "referidos España",
    "programas de referidos",
    "bonos por referidos",
    "ofertas fintech",
    "referidos bancos",
    "referidos crypto",
    "cashback España",
    "referidos empresas",
    "promociones apps",
    "oportunidades verificadas",
    "fintech España",
    "crypto Europa",
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

  verification: {
    google: "IIL8xKXHCF_OA0ZwPT66LW2QQlXQzEATpE4VbZfX1fU",
  },

  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "BENIA",
    title: "BENIA — Oportunidades verificadas",
    description:
      "Descubre oportunidades verificadas de referidos, fintech, banca, crypto, cashback, apps y servicios en España y Europa.",
  },

  twitter: {
    card: "summary_large_image",
    title: "BENIA — Oportunidades verificadas",
    description:
      "Descubre oportunidades verificadas de referidos, fintech, banca, crypto, cashback, apps y servicios en España y Europa.",
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
