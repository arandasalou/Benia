import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const siteUrl = "https://benia.vercel.app";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data, error } = await supabase
    .from("offers")
    .select("brand, updated_at")
    .eq("active", true);

  const home: MetadataRoute.Sitemap[number] = {
    url: siteUrl,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  };

  if (error || !data) {
    return [home];
  }

  const opportunityPages: MetadataRoute.Sitemap = data
    .filter((offer) => offer.brand)
    .map((offer) => ({
      url: `${siteUrl}/opportunities/${slugify(offer.brand)}`,
      lastModified: offer.updated_at
        ? new Date(offer.updated_at)
        : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  return [home, ...opportunityPages];
}
