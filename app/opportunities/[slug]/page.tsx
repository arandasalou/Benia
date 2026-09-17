import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

const siteUrl = "https://benia.vercel.app";

type Offer = {
  id: number;
  brand: string;
  category: string;
  icon: string | null;
  title: string;
  reward: string;
  description: string;
  referral_url: string;
  conditions: unknown;
  verified: boolean;
  source_type: string | null;
  score: number | null;
  expires_at: string | null;
  active: boolean;
  updated_at?: string | null;
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getOffer(slug: string): Promise<Offer | null> {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("active", true);

  if (error || !data) {
    return null;
  }

  const offer = (data as Offer[]).find(
    (item) => slugify(item.brand) === slug
  );

  return offer ?? null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const offer = await getOffer(slug);

  if (!offer) {
    return {
      title: "Opportunity not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${offer.brand} Referral Offer in Spain`;
  const description =
    `${offer.brand}: ${offer.reward}. ` +
    `${offer.description} Discover the current conditions and referral opportunity on BENIA.`;

  return {
    title,
    description,

    alternates: {
      canonical: `/opportunities/${slug}`,
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
      type: "article",
      url: `${siteUrl}/opportunities/${slug}`,
      siteName: "BENIA",
      title,
      description,
      locale: "en_US",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function formatDate(date: string | null) {
  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function getConditions(conditions: unknown): string[] {
  if (!Array.isArray(conditions)) {
    return [];
  }

  return conditions
    .map((condition) => {
      if (typeof condition === "string") {
        return condition;
      }

      if
