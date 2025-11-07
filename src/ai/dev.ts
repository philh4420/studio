import { config } from 'dotenv';
config();

import '@/ai/flows/generate-recipes-from-ingredients.ts';
import '@/ai/flows/suggest-complementary-ingredients.ts';