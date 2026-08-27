import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // resumo curto usado nos cards e no meta description de SEO
      summary: z.string().max(160),
      icon: z.string().optional(),
      order: z.number().default(0),
      cover: image().optional(),
    }),
});

const testimonials = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    // iniciais exibidas no avatar (ex.: "CM")
    initials: z.string(),
    // tema do depoimento, usado para ligar com o serviço relacionado
    topic: z.string().optional(),
    order: z.number().default(0),
  }),
});

const faq = defineCollection({
  type: 'content',
  schema: z.object({
    question: z.string(),
    order: z.number().default(0),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160),
      publishDate: z.date(),
      updatedDate: z.date().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { services, testimonials, faq, blog };
