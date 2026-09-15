 "use client";

import { useMemo, useState } from "react";
import { offers, categories, type Category } from "@/lib/offers";
import OfferCard from "@/components/OfferCard";

export default function Home() {
  const [active, setActive] = useState<Category>("Todas");
  const filtered = useMemo(
    () => active === "Todas" ? offers : offers.filter(o => o.category === active),
    [active]
  );

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="/" aria-label="BENIA inicio">
          <span className="brand-mark">B</span><span>benia</span>
        </a>
        <nav>
          <a href="#ofertas">Ofertas</a>
          <a href="#como-funciona">Cómo funciona</a>
        </nav>
      </header>

      <section className="hero">
        <div className="eyebrow">✦ OPORTUNIDADES SELECCIONADAS</div>
        <h1>Descubre.<br /><span>Regístrate. Benefíciate.</span></h1>
        <p>Las apps y ofertas que merecen la pena, reunidas en un solo lugar.</p>
        <a className="hero-cta" href="#ofertas">Ver ofertas <span>↓</span></a>
      </section>

      <section className="categories" aria-label="Categorías">
        {categories.map(category => (
          <button
            key={category}
            className={active === category ? "chip active" : "chip"}
            onClick={() => setActive(category)}
          >
            {category}
          </button>
        ))}
      </section>

      <section id="ofertas" className="offers-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">BENIA PICKS</div>
            <h2>Ofertas que merecen la pena</h2>
          </div>
          <span className="count">{filtered.length} ofertas</span>
        </div>
        <div className="offer-grid">
          {filtered.map(offer => <OfferCard key={offer.id} offer={offer} />)}
        </div>
      </section>

      <section id="como-funciona" className="how">
        <div className="eyebrow">SIMPLE POR DISEÑO</div>
        <h2>Encuentra. Haz clic. Disfruta.</h2>
        <div className="steps">
          <div><b>01</b><strong>Descubre</strong><p>Explora oportunidades seleccionadas por categoría.</p></div>
          <div><b>02</b><strong>Regístrate</strong><p>Entra desde el enlace de la oferta y cumple sus condiciones.</p></div>
          <div><b>03</b><strong>Benefíciate</strong><p>Obtén la recompensa directamente del proveedor.</p></div>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">B</span><span>benia</span></div>
        <p>BENIA es una plataforma informativa y de referencias. No es un banco ni un asesor financiero. Las condiciones pueden cambiar; comprueba siempre los términos del proveedor.</p>
        <span>© 2026 BENIA</span>
      </footer>
    </main>
  );
}
