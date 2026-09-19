import type { MetadataRoute } from "next";
import {getActiveOffers} from "@/lib/offers";
import {slugify} from "@/lib/slugify";
const siteUrl="https://benia.vercel.app";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const offers=await getActiveOffers();const now=new Date();return [{url:siteUrl,lastModified:now,changeFrequency:"daily",priority:1},{url:`${siteUrl}/opportunities`,lastModified:now,changeFrequency:"daily",priority:.9},...offers.map(o=>({url:`${siteUrl}/opportunities/${slugify(o.brand)}`,lastModified:o.updated_at?new Date(o.updated_at):now,changeFrequency:"daily" as const,priority:.8}))];}
