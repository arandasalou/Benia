import type { Offer } from "@/lib/offers";

export default function OfferCard({ offer }: { offer: Offer }) {
  return (
    <article className="offer-card">
      <div className="card-top">
        <div className="service-icon">{offer.icon}</div>

        <div className={offer.verified ? "verify" : "verify pending"}>
          {offer.verified ? "✓ Verificado" : "● Revisar"}
        </div>
      </div>

      <div className="category-label">{offer.category}</div>

      <h3>{offer.brand}</h3>

      <div className="reward">{offer.reward}</div>

      <p>{offer.description}</p>

      <div className="score-row">
        <span>BENIA SCORE</span>

        <div className="score">
          <div className="score-bar">
            <div
              className="score-fill"
              style={{
                width: `${offer.verified ? 94 : 78}%`,
              }}
            />
          </div>

          <strong>{offer.verified ? 94 : 78}</strong>
        </div>
      </div>

      <details>
        <summary>Ver condiciones</summary>

        <ul>
          {offer.conditions.map((condition, index) => (
            <li key={index}>{condition}</li>
          ))}
        </ul>
      </details>

      <a
        className="offer-cta"
        href={offer.referralUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>CONSEGUIR OFERTA</span>
        <span className="cta-arrow">↗</span>
      </a>
    </article>
  );
}
