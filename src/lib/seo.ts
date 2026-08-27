import { SITE } from './site';

export type SeoProps = {
  title: string;
  description: string;
  path: string; // ex.: "/", "/blog/meu-post"
  image?: string; // URL absoluta; usa a imagem padrão se omitido
  type?: 'website' | 'article';
  noindex?: boolean;
};

const DEFAULT_OG_IMAGE = `${SITE.url}/og-default.jpg`;

export function buildSeo(props: SeoProps) {
  const canonical = new URL(props.path, SITE.url).toString();
  return {
    title:
      props.path === '/'
        ? props.title
        : `${props.title} | ${SITE.therapistName}`,
    description: props.description,
    canonical,
    image: props.image ?? DEFAULT_OG_IMAGE,
    type: props.type ?? 'website',
    robots: props.noindex ? 'noindex, nofollow' : 'index, follow',
  };
}

// JSON-LD do negócio — aparece em toda página, reforça relevância local
// para "terapia holística São Paulo / São Roque".
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phoneE164,
    email: SITE.email,
    image: DEFAULT_OG_IMAGE,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    areaServed: SITE.address.areaServed.map((name) => ({
      '@type': 'City',
      name,
    })),
    sameAs: [SITE.social.instagram, SITE.social.tiktok],
  };
}

// FAQPage JSON-LD — gera rich snippets de pergunta/resposta no Google
// diretamente a partir da collection `faq`, sem duplicar conteúdo.
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function articleJsonLd(props: {
  title: string;
  description: string;
  path: string;
  publishDate: Date;
  updatedDate?: Date;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.title,
    description: props.description,
    image: props.image ?? DEFAULT_OG_IMAGE,
    author: {
      '@type': 'Person',
      name: SITE.therapistName,
    },
    datePublished: props.publishDate.toISOString(),
    dateModified: (props.updatedDate ?? props.publishDate).toISOString(),
    mainEntityOfPage: new URL(props.path, SITE.url).toString(),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE.url).toString(),
    })),
  };
}
