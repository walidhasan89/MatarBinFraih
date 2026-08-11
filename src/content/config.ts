import { defineCollection, z } from 'astro:content';

// NOTE: image fields are plain string paths into /public/images (generated
// placeholder SVGs — see scripts/generate-placeholders.mjs) rather than
// Astro's image() schema helper. Live network access to stock-photo hosts
// is blocked by this environment's egress policy, so placeholders were
// generated locally instead of fetched. Swap each path for a real MBF photo
// asset later; every usage site carries a `// TODO: replace with real MBF
// photo of X` comment.

const equipment = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    category: z.enum([
      'storage-tanks',
      'pumps',
      'well-control',
      'caravans-cabins',
      'specialized-units',
    ]),
    summary: z.string(),
    description: z.string().optional(),
    specs: z.array(z.string()),
    image: z.string(),
    imageAlt: z.string(),
    featured: z.boolean().default(false),
  }),
});

const services = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    shortSummary: z.string(),
    body: z.array(z.string()),
    image: z.string(),
    imageAlt: z.string(),
    order: z.number(),
    priceTable: z
      .array(
        z.object({
          no: z.string(),
          description: z.string(),
          qty: z.number(),
          price: z.string(),
          monthly: z.string(),
        })
      )
      .optional(),
  }),
});

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    featured: z.boolean().default(false),
    href: z.string(),
    ctaLabel: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    stats: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .optional(),
  }),
});

const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
  }),
});

const team = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
    avatar: z.string(),
  }),
});

export const collections = { equipment, services, projects, testimonials, team };
