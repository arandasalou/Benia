import type { Metadata } from "next";
import Link from "next/link";
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
      title: "Oportunidad no encontrada",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${offer.brand}: oferta de referido en España`;

  const description =
    `${offer.brand}: ${offer.reward}. ` +
    `${offer.description} Consulta las condiciones y la información actualizada de esta oportunidad en BENIA.`;

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
      locale: "es_ES",
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

  return new Intl.DateTimeFormat("es-ES", {
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

      if (
        typeof condition === "object" &&
        condition !== null &&
        "text" in condition &&
        typeof condition.text === "string"
      ) {
        return condition.text;
      }

      return null;
    })
    .filter((condition): condition is string => Boolean(condition));
}

export default async function OpportunityPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const offer = await getOffer(slug);

  if (!offer) {
    notFound();
  }

  const conditions = getConditions(offer.conditions);
  const expiryDate = formatDate(offer.expires_at);
  const updatedDate = formatDate(offer.updated_at ?? null);

  const pageUrl = `${siteUrl}/opportunities/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${offer.brand}: oferta de referido`,
    url: pageUrl,
    description: offer.description,

    isPartOf: {
      "@type": "WebSite",
      name: "BENIA",
      url: siteUrl,
    },

    about: {
      "@type": "Thing",
      name: offer.brand,
    },

    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "BENIA",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Oportunidades",
          item: `${siteUrl}/#offers`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: offer.brand,
          item: pageUrl,
        },
      ],
    },
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* BREADCRUMB */}

        <nav className="mb-8 text-sm text-slate-500">
          <Link
            href="/"
            className="transition hover:text-slate-900"
          >
            BENIA
          </Link>

          <span className="mx-2">/</span>

          <span>Oportunidades</span>

          <span className="mx-2">/</span>

          <span className="text-slate-700">
            {offer.brand}
          </span>
        </nav>

        <article>
          {/* HEADER */}

          <header className="border-b border-slate-200 pb-8">
            <div className="mb-5 flex items-center gap-4">
              {offer.icon && (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                  {offer.icon}
                </div>
              )}

              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                  {offer.category}
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                  {offer.brand}: oferta de referido
                </h1>
              </div>
            </div>

            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              {offer.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {offer.verified && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  ✓ Verificado
                </span>
              )}

              {!offer.verified && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                  ● Revisar
                </span>
              )}

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {offer.category}
              </span>

              {offer.score !== null && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  BENIA Score: {offer.score}
                </span>
              )}
            </div>
          </header>

          {/* REWARD */}

          <section className="py-8">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                Recompensa actual
              </p>

              <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {offer.reward}
              </p>

              <p className="mt-4 text-slate-600">
                Consulta las condiciones actuales antes de registrarte.
                Las recompensas y los requisitos de elegibilidad pueden
                cambiar.
              </p>

              <a
                href={offer.referral_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="!mt-6 !inline-flex !w-full !items-center !justify-center !rounded-xl !bg-slate-900 !px-6 !py-4 !text-base !font-semibold !text-white !no-underline !transition hover:!bg-slate-700 sm:!w-auto"
              >
                <span className="!text-white">
                  CONSEGUIR OFERTA
                </span>

                <span className="!ml-2 !text-white">
                  ↗
                </span>
              </a>
            </div>
          </section>

          {/* CONDITIONS */}

          {conditions.length > 0 && (
            <section className="border-t border-slate-200 py-8">
              <h2 className="text-2xl font-bold">
                Condiciones
              </h2>

              <ul className="mt-5 space-y-4">
                {conditions.map((condition, index) => (
                  <li
                    key={`${condition}-${index}`}
                    className="flex gap-3 text-slate-700"
                  >
                    <span className="font-semibold text-slate-400">
                      {index + 1}.
                    </span>

                    <span>{condition}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* INFORMATION */}

          <section className="border-t border-slate-200 py-8">
            <h2 className="text-2xl font-bold">
              Información de la oferta
            </h2>

            <dl className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200">
              <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between">
                <dt className="font-medium text-slate-500">
                  Marca
                </dt>

                <dd className="font-semibold">
                  {offer.brand}
                </dd>
              </div>

              <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between">
                <dt className="font-medium text-slate-500">
                  Categoría
                </dt>

                <dd className="font-semibold">
                  {offer.category}
                </dd>
              </div>

              <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between">
                <dt className="font-medium text-slate-500">
                  Recompensa
                </dt>

                <dd className="font-semibold">
                  {offer.reward}
                </dd>
              </div>

              {expiryDate && (
                <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between">
                  <dt className="font-medium text-slate-500">
                    Fecha de finalización
                  </dt>

                  <dd className="font-semibold">
                    {expiryDate}
                  </dd>
                </div>
              )}

              {updatedDate && (
                <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between">
                  <dt className="font-medium text-slate-500">
                    Última actualización
                  </dt>

                  <dd className="font-semibold">
                    {updatedDate}
                  </dd>
                </div>
              )}

              {offer.source_type && (
                <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between">
                  <dt className="font-medium text-slate-500">
                    Fuente
                  </dt>

                  <dd className="font-semibold">
                    {offer.source_type}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* BENIA METHODOLOGY */}

          <section className="border-t border-slate-200 py-8">
            <h2 className="text-2xl font-bold">
              Sobre esta oportunidad en BENIA
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              BENIA recopila oportunidades de referidos y promociones
              y presenta sus principales condiciones en un formato
              estructurado para facilitar su consulta.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              La información de las promociones puede cambiar con el
              tiempo. Antes de registrarte, revisa siempre las
              condiciones vigentes del proveedor.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Algunos enlaces de BENIA pueden ser enlaces de referido.
              Cuando corresponda, BENIA puede recibir una compensación
              si un usuario completa las acciones necesarias a través
              de uno de estos enlaces.
            </p>
          </section>

          {/* BACK */}

          <footer className="border-t border-slate-200 pt-8">
            <Link
              href="/"
              className="font-semibold text-slate-900 hover:underline"
            >
              ← Volver a todas las oportunidades
            </Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
