# BENIA — Enhanced

BENIA is a Spanish-first directory for referral programs, fintech, banking, crypto, cashback, apps and Business opportunities.

## What was improved

- Homepage is now a **Server Component**: active offers are present in the initial HTML for crawlers and AI systems.
- Client-side filtering remains fast and interactive through `HomeClient`.
- Stable dynamic sitemap includes `/opportunities` plus active opportunity pages.
- Spanish metadata, canonical URLs, robots directives and Google Search Console verification are included.
- Individual opportunity pages have their own metadata, canonical URL and JSON-LD breadcrumbs.
- Referral links use `nofollow` and open safely in a new tab.
- No fake ratings/reviews are generated from BENIA Score.
- Cleaner responsive UI with a stronger white / mint / electric-blue visual system.
- Scout endpoint is protected by `SCOUT_SECRET` when configured, stores discoveries as **pending**, and only emails when `SCOUT_TO_EMAIL` is configured.
- Scout never publishes opportunities automatically.

## Supabase

The existing `offers` table is expected to contain: `id, brand, category, icon, title, reward, description, referral_url, conditions, verified, source_type, score, expires_at, active, created_at, updated_at`.

Public access should remain limited to active offers through RLS. The service key is used only by the server-side Scout route.

## Environment variables

Use `.env.example` as the template. Never expose `SUPABASE_SECRET_KEY`, `OPENROUTER_API_KEY` or `RESEND_API_KEY` to the client.

## Deployment

1. Push the repo to GitHub.
2. Import into Vercel.
3. Add the Supabase public variables.
4. Deploy.
5. Confirm `/robots.txt` and `/sitemap.xml` work.
6. Keep the verified property in Google Search Console and submit `/sitemap.xml`.

## Editorial rule

BENIA should only publish rewards, conditions and links that can be evidenced. A personal referral link is not automatically a public affiliate link; check the provider's terms before publishing it openly.
