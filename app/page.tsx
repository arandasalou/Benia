"use client";

import { useMemo, useState } from "react";
import { offers, categories, type Category } from "@/lib/offers";
import OfferCard from "@/components/OfferCard";

const interests = [
  { icon: "💰", label: "Ganar dinero" },
  { icon: "🏦", label: "Finanzas" },
  { icon: "₿", label: "Crypto" },
  { icon: "💳", label: "Cashback" },
  { icon: "💼", label: "Business" },
  { icon: "📱", label: "Apps" },
];

export default function Home() {
  const [active, setActive] = useState<Category>("Todas");
  const [interestOpen, setInterestOpen] = useState(false);

  const filtered = useMemo(
    () =>
      active === "Todas"
        ? offers
        : offers.filter((offer) => offer.category === active),
    [active]
  );

  const featured = offers[0];

  return (
    <main>
      {/* NAVBAR */}
      <header className="topbar">
        <a className="brand" href="/" aria-label="BENIA inicio">
          <span className="brand-mark">B</span>
          <span>benia</span>
        </a>

        <div className="live-pill">
          <span className="live-dot" />
          BENIA LIVE
        </div>

        <nav>
          <a href="#ofertas">Ofertas</a>
          <a href="#como-funciona">Cómo funciona</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="floating-tag tag-one">+15 €</div>
        <div className="floating-tag tag-two">₿ Bonus</div>
        <div className="floating-tag tag-three">Cashback</div>
        <div className="floating-tag tag-four">0 € fees</div>

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
          Finanzas, crypto, apps y ofertas seleccionadas para que encuentres
          oportunidades sin perder tiempo.
        </p>

        <div className="hero-actions">
          <a className="hero-cta" href="#ofertas">
            Explorar oportunidades <span>↓</span>
          </a>

          <button
            className="interest-button"
            onClick={() => setInterestOpen(!interestOpen)}
          >
            ✨ ¿Qué me interesa?
          </button>
        </div>

        {interestOpen && (
          <div className="interest-panel">
            <div className="interest-title">
              <span>✨</span>
              <div>
                <strong>Personaliza tu feed</strong>
                <small>Elige lo que quieres descubrir</small>
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

                    setActive(category as Category);
                    setInterestOpen(false);
                    document
                      .getElementById("ofertas")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span>{item.icon}</span>
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
            <div className="eyebrow">BENIA LIVE</div>
            <h2>Lo que está pasando ahora</h2>
          </div>

          <div className="live-status">
            <span className="pulse" />
            Actualizado
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <strong>{offers.length}</strong>
            <small>ofertas activas</small>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✦</span>
            <strong>3</strong>
            <small>nuevas oportunidades</small>
          </div>

          <div className="stat-card">
            <span className="stat-icon">⏳</span>
            <strong>2</strong>
            <small>terminan pronto</small>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✓</span>
            <strong>24/7</strong>
            <small>selección BENIA</small>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="featured-section">
        <div className="featured-card">
          <div className="featured-background" />

          <div className="featured-content">
            <div className="featured-label">
              🔥 OPORTUNIDAD DESTACADA
            </div>

            <div className="featured-brand">
              <div className="featured-icon">{featured.icon}</div>

              <div>
                <span>{featured.category}</span>
                <h2>{featured.brand}</h2>
              </div>
            </div>

            <div className="featured-reward">{featured.reward}</div>

            <p>{featured.description}</p>

            <a
              href={featured.referralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="featured-cta"
            >
              CONSEGUIR OFERTA
              <span>↗</span>
            </a>
          </div>

          <div className="score-box">
            <small>BENIA SCORE</small>
            <strong>94</strong>
            <span>/100</span>
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section id="ofertas" className="offers-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">BENIA PICKS</div>
            <h2>Oportunidades para ti</h2>
          </div>

          <span className="count">{filtered.length} ofertas</span>
        </div>

        <div className="categories">
          {categories.map((category) => (
            <button
              key={category}
              className={active === category ? "chip active" : "chip"}
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="offer-grid">
          {filtered.map((offer, index) => (
            <div
              key={offer.id}
              className="offer-wrapper"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>
      </section>

      {/* ENDING SOON */}
      <section className="ending-section">
        <div className="eyebrow">⏳ NO LO DEJES PARA MAÑANA</div>

        <div className="ending-heading">
          <h2>Terminan pronto</h2>
          <span>Ofertas con fecha límite</span>
        </div>

        <div className="ending-card">
          <div className="ending-icon">O</div>

          <div className="ending-info">
            <strong>Openbank</strong>
            <span>Oferta de bienvenida</span>
          </div>

          <div className="ending-time">
            <small>FINALIZA</small>
            <strong>30 SEP</strong>
          </div>

          <a
            href="https://www.openbank.es/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver oferta ↗
          </a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="how">
        <div className="eyebrow">SIMPLE POR DISEÑO</div>

        <h2>
          Menos buscar.
          <br />
          <span>Más encontrar.</span>
        </h2>

        <div className="steps">
          <div>
            <b>01</b>
            <strong>Descubre</strong>
            <p>
              Explora oportunidades seleccionadas y encuentra las que
              realmente te interesan.
            </p>
          </div>

          <div>
            <b>02</b>
            <strong>Regístrate</strong>
            <p>
              Entra directamente desde BENIA y sigue los requisitos de cada
              oferta.
            </p>
          </div>

          <div>
            <b>03</b>
            <strong>Benefíciate</strong>
            <p>
              Completa las condiciones y recibe la recompensa del proveedor.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="brand footer-brand">
          <span className="brand-mark">B</span>
          <span>benia</span>
        </div>

        <p>
          BENIA es una plataforma informativa y de referencias. No es un banco,
          broker ni asesor financiero. Las condiciones de las ofertas pueden
          cambiar; comprueba siempre los términos del proveedor.
        </p>

        <span>© 2026 BENIA</span>
      </footer>
    </main>
  );
           }
