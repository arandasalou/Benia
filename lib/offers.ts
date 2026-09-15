export type Category = "Todas" | "Finanzas" | "Crypto" | "Apps" | "Business" | "Ofertas";

export type Offer = {
  id: string;
  brand: string;
  category: Exclude<Category, "Todas">;
  icon: string;
  title: string;
  reward: string;
  description: string;
  referralUrl: string;
  conditions: string[];
  verified: boolean;
  sourceType: "user_referral" | "official";
  expiresAt?: string;
};

export const categories: Category[] = ["Todas", "Finanzas", "Crypto", "Apps", "Business", "Ofertas"];

export const offers: Offer[] = [
  {
    id: "n26",
    brand: "N26",
    category: "Finanzas",
    icon: "N",
    title: "Cuenta N26",
    reward: "15 € de recompensa",
    description: "Abre tu cuenta desde el enlace de invitación.",
    referralUrl: "https://n26.com/r/luisfera62611c?cid=1T5&lang=es",
    conditions: ["Oferta comunicada por el usuario.", "La recompensa y requisitos dependen de las condiciones vigentes de N26."],
    verified: false,
    sourceType: "user_referral"
  },
  {
    id: "bitvavo",
    brand: "Bitvavo",
    category: "Crypto",
    icon: "₿",
    title: "Crypto + bonus",
    reward: "10 € en BTC",
    description: "Regístrate y consigue el bonus indicado en la invitación.",
    referralUrl: "https://bitvavo.com/invite?a=E7F622DC88",
    conditions: ["Usa el enlace de invitación.", "Consulta los requisitos vigentes antes de operar.", "La oferta puede estar sujeta a cambios."],
    verified: false,
    sourceType: "user_referral"
  },
  {
    id: "openbank",
    brand: "Openbank",
    category: "Finanzas",
    icon: "O",
    title: "Plan de invitación",
    reward: "50 € + posible extra Bizum",
    description: "Campaña comunicada por el usuario, con fecha indicada de finalización.",
    referralUrl: "https://www.openbank.es/",
    conditions: ["Según información aportada por el usuario: 50 € por cada parte que cumpla los requisitos.", "20 € extra por traer Bizum, según condiciones.", "Fecha indicada: 30/09/2026.", "Comprueba las condiciones oficiales antes de participar."],
    verified: false,
    sourceType: "user_referral",
    expiresAt: "2026-09-30"
  },
  {
    id: "revolut",
    brand: "Revolut",
    category: "Finanzas",
    icon: "R",
    title: "Cuenta Revolut",
    reward: "Recompensa de invitación",
    description: "Únete desde el enlace de invitación y revisa las condiciones de la campaña.",
    referralUrl: "https://revolut.com/referral/?referral-code=luisferrgu!SEP1-26-AR-H2&geo-redirect",
    conditions: ["Usa el enlace de invitación.", "La recompensa depende de la campaña y sus requisitos vigentes."],
    verified: false,
    sourceType: "user_referral"
  },
  {
    id: "revolut-business",
    brand: "Revolut Business",
    category: "Business",
    icon: "RB",
    title: "Cuenta Business",
    reward: "Promoción para empresas",
    description: "Oferta de referencia para empresas que cumplan los requisitos de la campaña.",
    referralUrl: "https://business.revolut.com/signup?promo=C2B-SEP1-26-AR&ext=luisferrgu&context=C2B_REFERRAL",
    conditions: ["Registro mediante el enlace de referencia.", "Verificación de empresa.", "Solicitar tarjeta.", "Añadir o recibir fondos.", "Realizar 3 pagos de al menos 10 € cada uno, según la promoción comunicada."],
    verified: false,
    sourceType: "user_referral"
  },
  {
    id: "wise",
    brand: "Wise",
    category: "Apps",
    icon: "W",
    title: "Wise",
    reward: "Oferta de bienvenida",
    description: "Prueba Wise desde el enlace de invitación.",
    referralUrl: "https://wise.com/invite/mit/luisa3504",
    conditions: ["Usa el enlace de invitación.", "La recompensa disponible depende de la campaña vigente y del país."],
    verified: false,
    sourceType: "user_referral"
  },
  {
    id: "unicaja",
    brand: "Unicaja",
    category: "Finanzas",
    icon: "U",
    title: "Plan Amigo",
    reward: "Recompensa según condiciones",
    description: "Invita a tus amigos desde tu enlace personalizado de Plan Amigo.",
    referralUrl: "https://hola.unicajabanco.es/plan-amigo/75PR-645J-516G",
    conditions: ["Enlace personalizado de referencia.", "La recompensa exacta depende de la campaña y de los requisitos aplicables.", "Comprueba las condiciones oficiales antes de participar."],
    verified: false,
    sourceType: "user_referral"
  }
];
