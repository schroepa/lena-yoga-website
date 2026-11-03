import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { kursSchema } from './lib/kurse';

export const collections = {
  kurse: defineCollection({
    loader: glob({ pattern: '*.json', base: './src/content/kurse' }),
    schema: kursSchema,
  }),
};
