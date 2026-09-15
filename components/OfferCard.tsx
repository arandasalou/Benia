type Offer = {
  id: number;
  brand: string;
  category: string;
  icon: string | null;
  title: string;
  reward: string;
  description: string | null;
  referral_url: string;
  conditions: string[] | null;
  verified: boolean | null;
  score: number | null;
};

export default function OfferCard({ offer }: { offer: Offer }) {
  const score = offer.score ?? 0;

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
              style={{ width: `${score}%` }}
            />
          </div>

          <strong>{score}</strong>
        </div>
      </div>

      <details>
        <summary>Ver condiciones</summary>

        <ul>
          {(offer.conditions ?? []).map((condition, index) => (
            <li key={index}>{condition}</li>
          ))}
        </ul>
      </details>

      <a
        className="offer-cta"
        href={offer.referral_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>CONSEGUIR OFERTA</span>
        <span className="cta-arrow">↗</span>
      </a>
    </article>
  );
}
