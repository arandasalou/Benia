import type { Offer } from "@/lib/offers";

export default function OfferCard({ offer }: { offer: Offer }) {
  return (
    <article className="offer-card">
      <div className="card-top">
        <div className="service-icon">{offer.icon}</div>
        <div className="verify">{offer.verified ? "✓ Verificado" : "• Pendiente"}</div>
      </div>
      <div className="category-label">{offer.category}</div>
      <h3>{offer.brand}</h3>
      <div className="reward">{offer.reward}</div>
      <p>{offer.description}</p>
      <details>
        <summary>Ver condiciones</summary>
        <ul>{offer.conditions.map((condition, i) => <li key={i}>{condition}</li>)}</ul>
      </details>
      <a
        className="offer-cta"
        href={offer.referralUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        CONSEGUIR OFERTA <span>↗</span>
      </a>
    </article>
  );
}
