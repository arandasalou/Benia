import type { MetadataRoute } from "next";

const siteUrl = "https://benia.vercel.app";

const opportunities = [
  "n26",
  "bitvavo",
  "openbank",
  "revolut",
  "revolut-business",
  "wise",
  "unicaja",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/opportunities`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...opportunities.map((slug) => ({
      url: `${siteUrl}/opportunities/${slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
