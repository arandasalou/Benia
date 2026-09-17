import Link from "next/link";

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

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function OfferCard({
  offer,
}: {
  offer: Offer;
}) {
  const score = offer.score ?? 0;
  const slug = slugify(offer.brand);

  return (
    <article className="offer-card">
      <div className="card-top">
        <div className="service-icon">
          {offer.icon}
        </div>

        <div
          className={
            offer.verified
              ? "verify"
              : "verify pending"
          }
        >
          {offer.verified
            ? "✓ Verificado"
            : "● Revisar"}
        </div>
      </div>

      <div className="category-label">
        {offer.category}
      </div>

      <h3>
        <Link
          href={`/opportunities/${slug}`}
          style={{
            color: "#10151c",
            textDecoration: "none",
          }}
        >
          {offer.brand}
        </Link>
      </h3>

      <div className="reward">
        {offer.reward}
      </div>

      <p>
        {offer.description}
      </p>

      <div className="score-row">
        <span>BENIA SCORE</span>

        <div className="score">
          <div className="score-bar">
            <div
              className="score-fill"
              style={{
                width: `${score}%`,
              }}
            />
          </div>

          <strong>{score}</strong>
        </div>
      </div>

      <details>
        <summary>
          Ver condiciones
        </summary>

        <ul>
          {(offer.conditions ?? []).map(
            (condition, index) => (
              <li key={index}>
                {condition}
              </li>
            )
          )}
        </ul>
      </details>

      <div
        className="offer-actions"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "18px",
        }}
      >
        <Link
          href={`/opportunities/${slug}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            background: "#10151c",
            color: "#ffffff",
            padding: "14px 16px",
            borderRadius: "13px",
            fontSize: "10px",
            fontWeight: 900,
            letterSpacing: "0.7px",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              color: "#ffffff",
            }}
          >
            VER DETALLES
          </span>

          <span
            style={{
              color: "#73f0c4",
              fontSize: "16px",
            }}
          >
            →
          </span>
        </Link>

        <a
          href={offer.referral_url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            background: "#10151c",
            color: "#ffffff",
            padding: "14px 16px",
            borderRadius: "13px",
            fontSize: "10px",
            fontWeight: 900,
            letterSpacing: "0.7px",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              color: "#ffffff",
            }}
          >
            CONSEGUIR OFERTA
          </span>

          <span
            style={{
              color: "#73f0c4",
              fontSize: "16px",
            }}
          >
            ↗
          </span>
        </a>
      </div>
    </article>
  );
}
