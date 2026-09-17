import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const siteUrl = "https://benia.vercel.app";

export const metadata: Metadata = {
  title: "Oportunidades y ofertas de referidos en España",
  description:
    "Explora oportunidades de referidos, recompensas, fintech, bancos, crypto, cashback, apps y promociones disponibles en España.",
  alternates: {
    canonical: "/opportunities",
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
    url: `${siteUrl}/opportunities`,
    siteName: "BENIA",
    title: "Oportunidades y ofertas de referidos en España | BENIA",
    description:
      "Explora oportunidades de referidos, recompensas, fintech, bancos, crypto, cashback, apps y promociones disponibles en España.",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oportunidades y ofertas de referidos en España | BENIA",
    description:
      "Explora oportunidades de referidos, recompensas, fintech, bancos, crypto, cashback, apps y promociones disponibles en España.",
  },
};

type Offer = {
  id: number;
  brand: string;
  category: string;
  icon: string | null;
  title: string;
  reward: string;
  description: string | null;
  referral_url: string;
  verified: boolean | null;
  score: number | null;
  expires_at: string | null;
  active: boolean | null;
  updated_at?: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(date: string | null) {
  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

async function getOffers(): Promise<Offer[]> {
  const { data, error } = await supabase
    .from("offers")
    .select(
      "id, brand, category, icon, title, reward, description, referral_url, verified, score, expires_at, active, updated_at"
    )
    .eq("active", true)
    .order("score", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as Offer[];
}

export default async function OpportunitiesPage() {
  const offers = await getOffers();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Oportunidades y ofertas de referidos en España",
    url: `${siteUrl}/opportunities`,
    description:
      "Listado de oportunidades de referidos, recompensas, fintech, bancos, crypto, cashback, apps y promociones disponibles en España.",
    isPartOf: {
      "@type": "WebSite",
      name: "BENIA",
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: offers.length,
      itemListElement: offers.map((offer, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: offer.brand,
        url: `${siteUrl}/opportunities/${slugify(offer.brand)}`,
      })),
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

      {/* HEADER */}

      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="flex items-center gap-3 font-bold"
            aria-label="BENIA inicio"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 font-black text-white">
              B
            </span>

            <span className="text-xl tracking-tight">
              benia
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Inicio
          </Link>
        </div>
      </header>

      {/* HERO */}

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <nav className="mb-8 text-sm text-slate-500">
            <Link
              href="/"
              className="hover:text-slate-900"
            >
              BENIA
            </Link>

            <span className="mx-2">/</span>

            <span className="text-slate-700">
              Oportunidades
            </span>
          </nav>

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
            BENIA OPPORTUNITIES
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            Oportunidades y ofertas de referidos en España
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Descubre promociones, recompensas y programas de referidos
            de fintech, bancos, crypto, apps, cashback y servicios
            digitales.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
              {offers.length} oportunidades activas
            </span>

            <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
              Actualizadas por BENIA
            </span>

            <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
              España
            </span>
          </div>
        </div>
      </section>

      {/* LIST */}

      <section className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Todas las oportunidades
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Explora las ofertas
            </h2>
          </div>

          <span className="text-sm text-slate-500">
            {offers.length} activas
          </span>
        </div>

        {offers.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
            <h2 className="text-xl font-bold">
              No hay oportunidades activas
            </h2>

            <p className="mt-3 text-slate-600">
              Vuelve a consultar más tarde.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => {
              const slug = slugify(offer.brand);
              const updated = formatDate(
                offer.updated_at ?? null
              );

              return (
                <article
                  key={offer.id}
                  className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                      {offer.icon}
                    </div>

                    {offer.verified ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                        ✓ Verificado
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        Revisar
                      </span>
                    )}
                  </div>

                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    {offer.category}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight">
                    <Link
                      href={`/opportunities/${slug}`}
                      className="group-hover:underline"
                    >
                      {offer.brand}
                    </Link>
                  </h2>

                  <p className="mt-2 font-medium text-slate-700">
                    {offer.title}
                  </p>

                  <div className="mt-5 text-2xl font-bold">
                    {offer.reward}
                  </div>

                  {offer.description && (
                    <p className="mt-3 line-clamp-3 leading-6 text-slate-600">
                      {offer.description}
                    </p>
                  )}

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                    {offer.score !== null ? (
                      <span className="text-xs font-semibold text-slate-500">
                        BENIA SCORE{" "}
                        <strong className="text-slate-900">
                          {offer.score}/100
                        </strong>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">
                        BENIA SCORE pendiente
                      </span>
                    )}

                    {offer.expires_at ? (
                      <span className="text-xs text-slate-500">
                        Hasta{" "}
                        {new Intl.DateTimeFormat("es-ES", {
                          day: "2-digit",
                          month: "short",
                        }).format(
                          new Date(offer.expires_at)
                        )}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">
                        Sin fecha indicada
                      </span>
                    )}
                  </div>

                  {updated && (
                    <p className="mt-3 text-xs text-slate-400">
                      Actualizado: {updated}
                    </p>
                  )}

                  <Link
                    href={`/opportunities/${slug}`}
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
                  >
                    Ver oportunidad
                    <span className="ml-2">→</span>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* SEO CONTENT */}

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">
            ¿Qué encontrarás en BENIA?
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            BENIA reúne oportunidades de referidos y promociones
            disponibles para usuarios en España. El catálogo puede
            incluir ofertas de bancos, plataformas fintech,
            aplicaciones, servicios digitales, crypto, cashback y
            programas para empresas.
          </p>

          <p className="mt-5 leading-8 text-slate-600">
            Cada oportunidad dispone de una página individual con la
            recompensa publicada, sus principales condiciones, estado
            de verificación y otra información disponible en BENIA.
          </p>

          <p className="mt-5 leading-8 text-slate-600">
            Las promociones pueden cambiar o finalizar. Antes de
            registrarte, comprueba siempre las condiciones actuales
            directamente con el proveedor.
          </p>

          <p className="mt-5 leading-8 text-slate-600">
            Algunos enlaces pueden ser enlaces de referido. Cuando
            corresponda, BENIA puede recibir una compensación si se
            completan determinadas acciones mediante estos enlaces.
          </p>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="font-bold text-slate-900"
          >
            BENIA
          </Link>

          <span>
            © 2026 BENIA
          </span>
        </div>
      </footer>
    </main>
  );
}
