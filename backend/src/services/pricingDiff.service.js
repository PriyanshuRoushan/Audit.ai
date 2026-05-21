import { getCurrentPricing } from './pricing.service.js';

export const detectPricingChanges = async (oldSnapshot) => {
  const currentPricing = await getCurrentPricing();
  const changes = [];

  if (!oldSnapshot || typeof oldSnapshot !== 'object') {
    return { hasChanges: false, changes: [] };
  }

  // Collect all unique tools across both snapshots
  const allTools = new Set([
    ...Object.keys(oldSnapshot),
    ...Object.keys(currentPricing)
  ]);

  for (const tool of allTools) {
    const oldPlans = oldSnapshot[tool] || {};
    const currentPlans = currentPricing[tool] || {};

    const allPlans = new Set([
      ...Object.keys(oldPlans),
      ...Object.keys(currentPlans)
    ]);

    for (const plan of allPlans) {
      const oldPrice = oldPlans[plan];
      const newPrice = currentPlans[plan];

      if (oldPrice !== undefined && newPrice !== undefined) {
        if (oldPrice !== newPrice) {
          changes.push({
            tool,
            plan,
            oldPrice,
            newPrice,
            difference: Number((newPrice - oldPrice).toFixed(2))
          });
        }
      } else if (oldPrice === undefined && newPrice !== undefined) {
        // Plan was added in the current pricing
        changes.push({
          tool,
          plan,
          oldPrice: null,
          newPrice,
          difference: newPrice
        });
      } else if (oldPrice !== undefined && newPrice === undefined) {
        // Plan was removed from the current pricing
        changes.push({
          tool,
          plan,
          oldPrice,
          newPrice: null,
          difference: -oldPrice
        });
      }
    }
  }

  return {
    hasChanges: changes.length > 0,
    changes
  };
};
