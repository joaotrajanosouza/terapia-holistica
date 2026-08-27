import { SITE } from './site';

export type SeoProps = {
  title: string;
  description: string;
  path: string; // ex.: "/", "/blog/meu-post"
  image?: string; // URL absoluta; usa a imagem padrão se omitido
  imageAlt?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
};

const DEFAULT_OG_IMAGE = new URL(SITE.images.hero, SITE.url).toString();

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
    imageAlt: props.imageAlt ?? `${SITE.therapistName} — Terapia Holística`,
    type: props.type ?? 'website',
    author: SITE.therapistName,
    publishedTime: props.publishedTime,
    modifiedTime: props.modifiedTime,
    section: props.section,
    tags: props.tags ?? [],
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
  imageAlt?: string;
  tags?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: props.title,
    description: props.description,
    image: props.image ?? DEFAULT_OG_IMAGE,
    imageAlt: props.imageAlt ?? `${SITE.therapistName} — Terapia Holística`,
    author: {
      '@type': 'Person',
      name: SITE.therapistName,
      url: SITE.url,
    },
    publisher: {
      '@type': 'Person',
      name: SITE.therapistName,
    },
    datePublished: props.publishDate.toISOString(),
    dateModified: (props.updatedDate ?? props.publishDate).toISOString(),
    mainEntityOfPage: new URL(props.path, SITE.url).toString(),
    inLanguage: 'pt-BR',
    keywords: props.tags?.join(', '),
  };
}

export function blogCollectionJsonLd(items: { title: string; description: string; path: string; publishDate: Date }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog sobre Terapia Holística e Gestão Emocional',
    description: 'Artigos e reflexões sobre gestão emocional, ansiedade, autoconhecimento e terapia holística.',
    url: new URL('/blog', SITE.url).toString(),
    inLanguage: 'pt-BR',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        url: new URL(item.path, SITE.url).toString(),
        description: item.description,
        datePublished: item.publishDate.toISOString(),
      })),
    },
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
