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

function formatShortDate(date: string | null) {
  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
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
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#10151c",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* HEADER */}

      <header
        style={{
          borderBottom: "1px solid #e7ebee",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#10151c",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "22px",
            }}
          >
            <span
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "11px",
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(135deg, #73f0c4, #6d8cff)",
                color: "#10151c",
                fontWeight: 900,
              }}
            >
              B
            </span>

            <span>benia</span>
          </Link>

          <Link
            href="/"
            style={{
              color: "#69727d",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            ← Inicio
          </Link>
        </div>
      </header>

      {/* HERO */}

      <section
        style={{
          borderBottom: "1px solid #e7ebee",
          background: "#f7f9fa",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "60px 24px",
          }}
        >
          <nav
            style={{
              marginBottom: "28px",
              fontSize: "14px",
              color: "#69727d",
            }}
          >
            <Link
              href="/"
              style={{
                color: "#69727d",
                textDecoration: "none",
              }}
            >
              BENIA
            </Link>

            <span style={{ margin: "0 8px" }}>
              /
            </span>

            <span style={{ color: "#10151c" }}>
              Oportunidades
            </span>
          </nav>

          <p
            style={{
              margin: 0,
              fontSize: "11px",
              fontWeight: 900,
              letterSpacing: "2px",
              color: "#69727d",
            }}
          >
            BENIA OPPORTUNITIES
          </p>

          <h1
            style={{
              maxWidth: "850px",
              margin: "16px 0 0",
              fontSize: "clamp(38px, 7vw, 68px)",
              lineHeight: 0.98,
              letterSpacing: "-3px",
              color: "#10151c",
            }}
          >
            Oportunidades y ofertas de referidos en España
          </h1>

          <p
            style={{
              maxWidth: "680px",
              margin: "24px 0 0",
              fontSize: "18px",
              lineHeight: 1.6,
              color: "#69727d",
            }}
          >
            Descubre promociones, recompensas y programas de
            referidos de fintech, bancos, crypto, apps, cashback
            y servicios digitales.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "28px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                padding: "9px 14px",
                borderRadius: "999px",
                background: "#ffffff",
                border: "1px solid #e7ebee",
                color: "#10151c",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              {offers.length} oportunidades activas
            </span>

            <span
              style={{
                display: "inline-flex",
                padding: "9px 14px",
                borderRadius: "999px",
                background: "#ffffff",
                border: "1px solid #e7ebee",
                color: "#10151c",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              España
            </span>

            <span
              style={{
                display: "inline-flex",
                padding: "9px 14px",
                borderRadius: "999px",
                background: "#ffffff",
                border: "1px solid #e7ebee",
                color: "#10151c",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              Información estructurada
            </span>
          </div>
        </div>
      </section>

      {/* OFFERS */}

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "60px 24px 80px",
        }}
      >
        <div
          style={{
            marginBottom: "32px",
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "1.8px",
                color: "#89929c",
              }}
            >
              TODAS LAS OPORTUNIDADES
            </p>

            <h2
              style={{
                margin: "8px 0 0",
                fontSize: "38px",
                letterSpacing: "-2px",
              }}
            >
              Explora las ofertas
            </h2>
          </div>

          <span
            style={{
              color: "#89929c",
              fontSize: "13px",
            }}
          >
            {offers.length} activas
          </span>
        </div>

        {offers.length === 0 ? (
          <div
            style={{
              padding: "40px",
              borderRadius: "24px",
              border: "1px solid #e7ebee",
              background: "#f7f9fa",
              textAlign: "center",
            }}
          >
            <h2>
              No hay oportunidades activas
            </h2>

            <p
              style={{
                color: "#69727d",
              }}
            >
              Vuelve a consultar más tarde.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            {offers.map((offer) => {
              const slug = slugify(offer.brand);
              const updated = formatDate(
                offer.updated_at ?? null
              );
              const expiry = formatShortDate(
                offer.expires_at
              );

              return (
                <article
                  key={offer.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    padding: "24px",
                    borderRadius: "24px",
                    border: "1px solid #e7ebee",
                    background: "#ffffff",
                    boxShadow:
                      "0 10px 35px rgba(16,21,28,0.035)",
                  }}
                >
                  {/* TOP */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "17px",
                        background: "#f1f5f6",
                        fontSize: "25px",
                        fontWeight: 900,
                      }}
                    >
                      {offer.icon}
                    </div>

                    {offer.verified ? (
                      <span
                        style={{
                          padding: "7px 10px",
                          borderRadius: "999px",
                          background: "#ecfbf6",
                          color: "#168968",
                          fontSize: "11px",
                          fontWeight: 800,
                        }}
                      >
                        ✓ Verificado
                      </span>
                    ) : (
                      <span
                        style={{
                          padding: "7px 10px",
                          borderRadius: "999px",
                          background: "#fff3cf",
                          color: "#94621d",
                          fontSize: "11px",
                          fontWeight: 800,
                        }}
                      >
                        Revisar
                      </span>
                    )}
                  </div>

                  {/* CATEGORY */}

                  <p
                    style={{
                      margin: "24px 0 0",
                      fontSize: "10px",
                      fontWeight: 900,
                      letterSpacing: "1.5px",
                      color: "#9aa3ad",
                      textTransform: "uppercase",
                    }}
                  >
                    {offer.category}
                  </p>

                  {/* BRAND */}

                  <h2
                    style={{
                      margin: "6px 0 0",
                      fontSize: "27px",
                      letterSpacing: "-1px",
                    }}
                  >
                    <Link
                      href={`/opportunities/${slug}`}
                      style={{
                        color: "#10151c",
                        textDecoration: "none",
                      }}
                    >
                      {offer.brand}
                    </Link>
                  </h2>

                  {/* TITLE */}

                  <p
                    style={{
                      margin: "7px 0 0",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#69727d",
                    }}
                  >
                    {offer.title}
                  </p>

                  {/* REWARD */}

                  <div
                    style={{
                      marginTop: "20px",
                      fontSize: "25px",
                      lineHeight: 1.15,
                      fontWeight: 900,
                      letterSpacing: "-1px",
                      color: "#10151c",
                    }}
                  >
                    {offer.reward}
                  </div>

                  {/* DESCRIPTION */}

                  {offer.description && (
                    <p
                      style={{
                        margin: "12px 0 0",
                        color: "#69727d",
                        fontSize: "14px",
                        lineHeight: 1.55,
                      }}
                    >
                      {offer.description}
                    </p>
                  )}

                  {/* INFO */}

                  <div
                    style={{
                      marginTop: "20px",
                      paddingTop: "16px",
                      borderTop: "1px solid #e7ebee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    {offer.score !== null ? (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#69727d",
                        }}
                      >
                        BENIA SCORE{" "}
                        <strong
                          style={{
                            color: "#10151c",
                          }}
                        >
                          {offer.score}/100
                        </strong>
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#9aa3ad",
                        }}
                      >
                        Score pendiente
                      </span>
                    )}

                    {expiry ? (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#69727d",
                        }}
                      >
                        Hasta {expiry}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#9aa3ad",
                        }}
                      >
                        Sin fecha
                      </span>
                    )}
                  </div>

                  {updated && (
                    <p
                      style={{
                        margin: "10px 0 0",
                        fontSize: "11px",
                        color: "#9aa3ad",
                      }}
                    >
                      Actualizado: {updated}
                    </p>
                  )}

                  {/* BUTTON */}

                  <Link
                    href={`/opportunities/${slug}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      marginTop: "20px",
                      padding: "15px 17px",
                      borderRadius: "13px",
                      background: "#10151c",
                      color: "#ffffff",
                      textDecoration: "none",
                      fontSize: "11px",
                      fontWeight: 900,
                      letterSpacing: "0.8px",
                      boxSizing: "border-box",
                    }}
                  >
                    <span
                      style={{
                        color: "#ffffff",
                      }}
                    >
                      VER OPORTUNIDAD
                    </span>

                    <span
                      style={{
                        color: "#73f0c4",
                        fontSize: "18px",
                        lineHeight: 1,
                      }}
                    >
                      →
                    </span>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* SEO CONTENT */}

      <section
        style={{
          borderTop: "1px solid #e7ebee",
          background: "#f7f9fa",
        }}
      >
        <div
          style={{
            maxWidth: "850px",
            margin: "0 auto",
            padding: "65px 24px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "32px",
              letterSpacing: "-1.5px",
            }}
          >
            ¿Qué encontrarás en BENIA?
          </h2>

          <p
            style={{
              marginTop: "20px",
              color: "#69727d",
              fontSize: "16px",
              lineHeight: 1.8,
            }}
          >
            BENIA reúne oportunidades de referidos y promociones
            disponibles para usuarios en España. El catálogo puede
            incluir ofertas de bancos, plataformas fintech,
            aplicaciones, servicios digitales, crypto, cashback y
            programas para empresas.
          </p>

          <p
            style={{
              marginTop: "18px",
              color: "#69727d",
              fontSize: "16px",
              lineHeight: 1.8,
            }}
          >
            Cada oportunidad dispone de una página individual con
            información sobre la recompensa publicada, sus
            principales condiciones, estado de verificación y otros
            datos disponibles en BENIA.
          </p>

          <p
            style={{
              marginTop: "18px",
              color: "#69727d",
              fontSize: "16px",
              lineHeight: 1.8,
            }}
          >
            Las promociones pueden cambiar o finalizar. Antes de
            registrarte, comprueba siempre las condiciones actuales
            directamente con el proveedor.
          </p>

          <p
            style={{
              marginTop: "18px",
              color: "#69727d",
              fontSize: "16px",
              lineHeight: 1.8,
            }}
          >
            Algunos enlaces pueden ser enlaces de referido. Cuando
            corresponda, BENIA puede recibir una compensación si se
            completan determinadas acciones mediante estos enlaces.
          </p>
        </div>
      </section>

      {/* FOOTER */}

      <footer
        style={{
          borderTop: "1px solid #e7ebee",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "28px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            color: "#69727d",
            fontSize: "13px",
          }}
        >
          <Link
            href="/"
            style={{
              color: "#10151c",
              textDecoration: "none",
              fontWeight: 900,
            }}
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
