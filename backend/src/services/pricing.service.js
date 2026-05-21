import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getCurrentPricing = async () => {
  const pricingPath = path.join(__dirname, '../data/pricing.json');
  const pricingData = await fs.readFile(pricingPath, 'utf-8');
  return JSON.parse(pricingData);
};
