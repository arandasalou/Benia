# BENIA MVP

**Descubre. Regístrate. Benefíciate.**

BENIA es una plataforma mobile-first para descubrir apps, servicios financieros, crypto, herramientas business y promociones.

## Stack

- Next.js + TypeScript
- Tailwind CSS
- Vercel-ready
- Supabase-ready (el MVP funciona sin Supabase)

## Ejecutar localmente

Requiere Node.js 20+.

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Subir a GitHub

1. Crea/abre el repositorio `arandasalou/Benia`.
2. Sube **el contenido de esta carpeta**, no la carpeta contenedora.
3. Haz commit a `main`.

## Desplegar en Vercel

1. Importa el repositorio desde Vercel.
2. Framework: Next.js (detección automática).
3. No necesitas variables de entorno para esta primera versión.
4. Deploy.

## Próxima fase

- Migrar `lib/offers.ts` a Supabase.
- Panel admin para crear/editar ofertas.
- Campos `verified_at`, `expires_at`, `source_url` y `score`.
- Verificación automática de condiciones.
- Sistema de favoritos.
- Analítica de clics/conversiones.
- Capa IA para detectar cambios y oportunidades.
- Email de alertas solo para oportunidades con score alto.

## Importante

Las recompensas de las ofertas pueden cambiar. Los datos de algunas ofertas iniciales proceden de referencias aportadas por el propietario del proyecto y están marcadas como no verificadas. Antes de publicar una recompensa como "Verificada", hay que contrastarla con la fuente oficial.

BENIA no es un banco, broker, exchange ni asesor financiero. Es una plataforma informativa y de referencias.
