// Fonte única de verdade para dados do negócio.
// Trocar aqui reflete em toda a UI e em todo o JSON-LD de SEO.
export const SITE = {
  name: "Terapia Holística — Leandro Eduardo Silva",
  therapistName: "Leandro Eduardo Silva",
  url: "https://terapiaholistica.com.br", // atualizar com o domínio final
  description:
    "Transforme suas emoções e encontre equilíbrio interior com Terapia Holística em São Paulo, São Roque e região. Sessões online de gestão emocional comportamental com Leandro Eduardo Silva.",
  phoneDisplay: "(12) 99138-9232",
  phoneE164: "+5512991389232",
  whatsapp: {
    number: "5512991389232",
    defaultMessage: "Olá! Gostaria de agendar uma sessão.",
  },
  email: "les.motivacional@hotmail.com", // atualizar com o e-mail real
  address: {
    locality: "São Paulo",
    region: "SP",
    country: "BR",
    areaServed: ["São Paulo", "São Roque"],
  },
  geo: {
    latitude: -23.55052,
    longitude: -46.633308,
  },
  social: {
    instagram: "https://www.instagram.com/les_motivacional",
    tiktok: "https://www.tiktok.com/@les_motivacional",
  },
  images: {
    logo: "/logo.jpeg",
    portrait: "/certificado.jpeg",
    hero: "/capa.jpg",
  },
} as const;

export function whatsappLink(
  message = "Olá! Gostaria de agendar uma sessão.",
): string {
  return `https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
