"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import OfferCard from "@/components/OfferCard";

type Category =
  | "Todas"
  | "Finanzas"
  | "Crypto"
  | "Apps"
  | "Business"
  | "Ofertas";

type Offer = {
  id: number;
  brand: string;
  category: Exclude<Category, "Todas">;
  icon: string | null;
  title: string;
  reward: string;
  description: string | null;
  referral_url: string;
  conditions: string[] | null;
  verified: boolean | null;
  source_type: string | null;
  score: number | null;
  expires_at: string | null;
  active: boolean | null;
};

const categories: Category[] = [
  "Todas",
  "Finanzas",
  "Crypto",
  "Apps",
  "Business",
  "Ofertas",
];

const interests = [
  { icon: "💰", label: "Ganar dinero" },
  { icon: "🏦", label: "Finanzas" },
  { icon: "₿", label: "Crypto" },
  { icon: "💳", label: "Cashback" },
  { icon: "💼", label: "Business" },
  { icon: "📱", label: "Apps" },
];

export default function Home() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [active, setActive] = useState<Category>("Todas");
  const [interestOpen, setInterestOpen] = useState(false);

  useEffect(() => {
    async function loadOffers() {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("active", true)
        .order("score", { ascending: false });

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        setOffers((data ?? []) as Offer[]);
      }

      setLoading(false);
    }

    loadOffers();
  }, []);

  const filtered = useMemo(() => {
    if (active === "Todas") {
      return offers;
    }

    return offers.filter((offer) => offer.category === active);
  }, [active, offers]);

  const featured = offers[0];

  const endingSoon = useMemo(() => {
    return offers
      .filter((offer) => offer.expires_at)
      .sort((a, b) => {
        return (
          new Date(a.expires_at!).getTime() -
          new Date(b.expires_at!).getTime()
        );
      })[0];
  }, [offers]);

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loading-logo">
          <span className="brand-mark">B</span>
          <span>benia</span>
        </div>

        <div className="loading-spinner" />

        <p>Descubriendo oportunidades...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="loading-screen">
        <div className="loading-logo">
          <span className="brand-mark">B</span>
          <span>benia</span>
        </div>

        <h2>No hemos podido cargar las ofertas</h2>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main>
      {/* NAVBAR */}

      <header className="topbar">
        <Link
          className="brand"
          href="/"
          aria-label="BENIA inicio"
        >
          <span className="brand-mark">B</span>
          <span>benia</span>
        </Link>

        <div className="live-pill">
          <span className="live-dot" />
          BENIA LIVE
        </div>

        <nav>
          <Link href="/opportunities">
            Oportunidades
          </Link>

          <a href="#ofertas">
            Ofertas
          </a>

          <a href="#como-funciona">
            Cómo funciona
          </a>
        </nav>
      </header>

      {/* HERO */}

      <section className="hero">
        <div className="floating-tag tag-one">
          +15 €
        </div>

        <div className="floating-tag tag-two">
          ₿ Bonus
        </div>

        <div className="floating-tag tag-three">
          Cashback
        </div>

        <div className="floating-tag tag-four">
          0 € fees
        </div>

        <div className="hero-glow" />

        <div className="eyebrow hero-eyebrow">
          ✦ LAS OPORTUNIDADES QUE MERECEN LA PENA
        </div>

        <h1>
          Descubre.
          <br />
          <span>Regístrate.</span>
          <br />
          <strong>Benefíciate.</strong>
        </h1>

        <p>
          Finanzas, crypto, apps y ofertas seleccionadas para que
          encuentres oportunidades sin perder tiempo.
        </p>

        <div className="hero-actions">
          <a
            className="hero-cta"
            href="#ofertas"
          >
            Explorar oportunidades
            <span>↓</span>
          </a>

          <Link
            className="interest-button"
            href="/opportunities"
          >
            Ver todas las oportunidades →
          </Link>

          <button
            className="interest-button"
            onClick={() =>
              setInterestOpen(!interestOpen)
            }
          >
            ✨ ¿Qué me interesa?
          </button>
        </div>

        {interestOpen && (
          <div className="interest-panel">
            <div className="interest-title">
              <span>✨</span>

              <div>
                <strong>
                  Personaliza tu feed
                </strong>

                <small>
                  Elige lo que quieres descubrir
                </small>
              </div>
            </div>

            <div className="interest-grid">
              {interests.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    const category =
                      item.label === "Finanzas"
                        ? "Finanzas"
                        : item.label === "Crypto"
                          ? "Crypto"
                          : item.label === "Business"
                            ? "Business"
                            : item.label === "Apps"
                              ? "Apps"
                              : "Todas";

                    setActive(
                      category as Category
                    );

                    setInterestOpen(false);

                    document
                      .getElementById("ofertas")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });
                  }}
                >
                  <span>
                    {item.icon}
                  </span>

                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* LIVE STATS */}

      <section className="live-section">
        <div className="live-header">
          <div>
            <div className="eyebrow">
              BENIA LIVE
            </div>

            <h2>
              Lo que está pasando ahora
            </h2>
          </div>

          <div className="live-status">
            <span className="pulse" />
            Actualizado
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">
              🔥
            </span>

            <strong>
              {offers.length}
            </strong>

            <small>
              ofertas activas
            </small>
          </div>

          <div className="stat-card">
            <span className="stat-icon">
              ✦
            </span>

            <strong>
              {Math.min(offers.length, 3)}
            </strong>

            <small>
              nuevas oportunidades
            </small>
          </div>

          <div className="stat-card">
            <span className="stat-icon">
              ⏳
            </span>

            <strong>
              {
                offers.filter(
                  (offer) =>
                    offer.expires_at
                ).length
              }
            </strong>

            <small>
              terminan pronto
            </small>
          </div>

          <div className="stat-card">
            <span className="stat-icon">
              ✓
            </span>

            <strong>
              24/7
            </strong>

            <small>
              selección BENIA
            </small>
          </div>
        </div>
      </section>

      {/* FEATURED */}

      {featured && (
        <section className="featured-section">
          <div className="featured-card">
            <div className="featured-background" />

            <div className="featured-content">
              <div className="featured-label">
                🔥 OPORTUNIDAD DESTACADA
              </div>

              <div className="featured-brand">
                <div className="featured-icon">
                  {featured.icon}
                </div>

                <div>
                  <span>
                    {featured.category}
                  </span>

                  <h2>
                    {featured.brand}
                  </h2>
                </div>
              </div>

              <div className="featured-reward">
                {featured.reward}
              </div>

              <p>
                {featured.description}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <Link
                  href={`/opportunities/${featured.brand
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(
                      /[\u0300-\u036f]/g,
                      ""
                    )
                    .replace(
                      /[^a-z0-9]+/g,
                      "-"
                    )
                    .replace(
                      /^-+|-+$/g,
                      ""
                    )}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "20px",
                    background: "#ffffff",
                    color: "#10151c",
                    padding: "15px 18px",
                    borderRadius: "13px",
                    fontSize: "10px",
                    fontWeight: 900,
                    letterSpacing: "0.7px",
                    textDecoration: "none",
                  }}
                >
                  VER OPORTUNIDAD
                  <span
                    style={{
                      color: "#1cae8c",
                      fontSize: "17px",
                    }}
                  >
                    →
                  </span>
                </Link>

                <a
                  href={
                    featured.referral_url
                  }
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "20px",
                    background: "#ffffff",
                    color: "#10151c",
                    padding: "15px 18px",
                    borderRadius: "13px",
                    fontSize: "10px",
                    fontWeight: 900,
                    letterSpacing: "0.7px",
                    textDecoration: "none",
                  }}
                >
                  CONSEGUIR OFERTA
                  <span
                    style={{
                      color: "#1cae8c",
                      fontSize: "17px",
                    }}
                  >
                    ↗
                  </span>
                </a>
              </div>
            </div>

            <div className="score-box">
              <small>
                BENIA SCORE
              </small>

              <strong>
                {featured.score ?? 0}
              </strong>

              <span>
                /100
              </span>
            </div>
          </div>
        </section>
      )}

      {/* OFFERS */}

      <section
        id="ofertas"
        className="offers-section"
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              BENIA PICKS
            </div>

            <h2>
              Oportunidades para ti
            </h2>
          </div>

          <span className="count">
            {filtered.length} ofertas
          </span>
        </div>

        <div className="categories">
          {categories.map((category) => (
            <button
              key={category}
              className={
                active === category
                  ? "chip active"
                  : "chip"
              }
              onClick={() =>
                setActive(category)
              }
            >
              {category}
            </button>
          ))}
        </div>

        <div className="offer-grid">
          {filtered.map(
            (offer, index) => (
              <div
                key={offer.id}
                className="offer-wrapper"
                style={{
                  animationDelay:
                    `${index * 70}ms`,
                }}
              >
                <OfferCard
                  offer={offer}
                />
              </div>
            )
          )}
        </div>

        {/* SEO INTERNAL LINK */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <Link
            href="/opportunities"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "15px 22px",
              borderRadius: "999px",
              background: "#10151c",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.5px",
            }}
          >
            VER TODAS LAS OPORTUNIDADES
            <span
              style={{
                color: "#73f0c4",
                fontSize: "17px",
              }}
            >
              →
            </span>
          </Link>
        </div>
      </section>

      {/* ENDING SOON */}

      {endingSoon && (
        <section className="ending-section">
          <div className="eyebrow">
            ⏳ NO LO DEJES PARA MAÑANA
          </div>

          <div className="ending-heading">
            <h2>
              Terminan pronto
            </h2>

            <span>
              Ofertas con fecha límite
            </span>
          </div>

          <div className="ending-card">
            <div className="ending-icon">
              {endingSoon.icon}
            </div>

            <div className="ending-info">
              <strong>
                {endingSoon.brand}
              </strong>

              <span>
                {endingSoon.title}
              </span>
            </div>

            <div className="ending-time">
              <small>
                FINALIZA
              </small>

              <strong>
                {new Date(
                  endingSoon.expires_at!
                ).toLocaleDateString(
                  "es-ES",
                  {
                    day: "2-digit",
                    month: "short",
                  }
                )}
              </strong>
            </div>

            <a
              href={
                endingSoon.referral_url
              }
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Ver oferta ↗
            </a>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}

      <section
        id="como-funciona"
        className="how"
      >
        <div className="eyebrow">
          SIMPLE POR DISEÑO
        </div>

        <h2>
          Menos buscar.
          <br />
          <span>
            Más encontrar.
          </span>
        </h2>

        <div className="steps">
          <div>
            <b>01</b>

            <strong>
              Descubre
            </strong>

            <p>
              Explora oportunidades
              seleccionadas y encuentra
              las que realmente te
              interesan.
            </p>
          </div>

          <div>
            <b>02</b>

            <strong>
              Regístrate
            </strong>

            <p>
              Entra directamente desde
              BENIA y sigue los requisitos
              de cada oferta.
            </p>
          </div>

          <div>
            <b>03</b>

            <strong>
              Benefíciate
            </strong>

            <p>
              Completa las condiciones y
              recibe la recompensa del
              proveedor.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer>
        <div className="brand footer-brand">
          <span className="brand-mark">
            B
          </span>

          <span>
            benia
          </span>
        </div>

        <p>
          BENIA es una plataforma
          informativa y de referencias.
          No es un banco, broker ni
          asesor financiero. Las
          condiciones de las ofertas
          pueden cambiar; comprueba
          siempre los términos del
          proveedor.
        </p>

        <span>
          © 2026 BENIA
        </span>
      </footer>
    </main>
  );
}
