import { getCurrentPricing } from './pricing.service.js';
import { supabase } from '../config/supabase.js';
import { generateAuditReport } from './ai.service.js';
import { getAiUsageScore } from '../utils/aiUsageScore.js';

export const calculateTotalCost = (metrics, pricing, pricingSnapshot) => {
  let totalCost = 0;
  for (const [toolId, metric] of Object.entries(metrics || {})) {
    const toolPricing = pricing[toolId];
    if (!toolPricing) continue;

    const seats = parseInt(metric.seats || 0, 10);
    const spend = parseFloat(metric.spend || 0);

    if (toolId.includes('api')) {
      const planKey = metric.plan?.toLowerCase().replace(/ /g, '_');
      const newPrice = toolPricing[planKey];
      const oldPrice = pricingSnapshot?.[toolId]?.[planKey];

      if (oldPrice && newPrice && oldPrice > 0) {
        totalCost += (spend * (newPrice / oldPrice));
      } else {
        totalCost += (newPrice !== undefined ? newPrice : spend);
      }
    } else {
      const planKey = metric.plan?.toLowerCase().replace(/ /g, '_');
      let pricePerSeat = toolPricing[planKey];
      if (pricePerSeat === undefined) {
        const prices = Object.values(toolPricing).filter(p => typeof p === 'number');
        pricePerSeat = prices.length > 0 ? Math.max(...prices) : 0;
      }
      totalCost += pricePerSeat * seats;
    }
  }
  return totalCost;
};

export const reRunAuditService = async (auditId) => {
  // 1. Fetch old audit details
  const { data: audit, error: auditError } = await supabase
    .from('audits')
    .select('*')
    .eq('id', auditId)
    .single();

  if (auditError || !audit) {
    throw new Error('Audit not found');
  }

  // 2. Fetch response data
  const { data: response, error: responseError } = await supabase
    .from('audit_responses')
    .select('response_data')
    .eq('audit_id', auditId)
    .single();

  if (responseError || !response) {
    throw new Error('Audit response data not found');
  }

  // 3. Fetch old report details
  const { data: oldReport, error: reportError } = await supabase
    .from('reports')
    .select('*')
    .eq('id', auditId) // Wait, is the reports table primary key `id` or `audit_id`? Let's check schema.sql.
    // In schema.sql: "id UUID PRIMARY KEY DEFAULT uuid_generate_v4()", and "audit_id UUID REFERENCES audits(id)"
    // So we should query by .eq('audit_id', auditId)
    .eq('audit_id', auditId)
    .single();

  const metrics = response.response_data?.metrics || {};
  const selectedTools = response.response_data?.tools || [];

  // Calculate old monthly cost
  const oldMonthlyCost = Object.values(metrics).reduce((sum, m) => sum + parseFloat(m.spend || 0), 0);

  // 4. Fetch latest pricing
  const currentPricing = await getCurrentPricing();

  // Calculate new monthly cost using latest pricing
  const newMonthlyCost = calculateTotalCost(metrics, currentPricing, audit.pricing_snapshot);

  // 5. Re-run audit logic
  const userInputPrompt = JSON.stringify(response.response_data);
  const usageScoreResult = await getAiUsageScore(userInputPrompt);

  const aiReport = await generateAuditReport({
    website: audit.website,
    responseData: response.response_data,
    aiUsageScore: usageScoreResult.score
  });

  // Calculate differences
  const oldScore = oldReport ? oldReport.score : 50;
  const newScore = aiReport.score;
  const scoreDifference = newScore - oldScore;
  const savingsDifference = oldMonthlyCost - newMonthlyCost;

  const oldRecommendations = oldReport?.recommendations || [];
  const newRecommendations = aiReport.recommendations || [];
  const recommendationChanged = JSON.stringify(oldRecommendations) !== JSON.stringify(newRecommendations);

  // 6. Update database records
  // Update the audits table: invalidated = false, pricing_snapshot = currentPricing
  await supabase
    .from('audits')
    .update({
      pricing_snapshot: currentPricing,
      invalidated: false,
      status: 'Completed'
    })
    .eq('id', auditId);

  // Update or insert report
  if (oldReport) {
    await supabase
      .from('reports')
      .update({
        score: aiReport.score,
        risk_level: aiReport.risk_level,
        summary: aiReport.summary,
        ai_usage_score: aiReport.ai_usage_score,
        issues: aiReport.issues || [],
        recommendations: aiReport.recommendations || [],
        seo_notes: aiReport.seo_notes || '',
        performance_notes: aiReport.performance_notes || ''
      })
      .eq('audit_id', auditId);
  } else {
    await supabase
      .from('reports')
      .insert([
        {
          audit_id: auditId,
          score: aiReport.score,
          risk_level: aiReport.risk_level,
          summary: aiReport.summary,
          ai_usage_score: aiReport.ai_usage_score,
          issues: aiReport.issues || [],
          recommendations: aiReport.recommendations || [],
          seo_notes: aiReport.seo_notes || '',
          performance_notes: aiReport.performance_notes || ''
        }
      ]);
  }

  // Generate change summary for tools & pricing
  const toolChanges = [];
  for (const tool of selectedTools) {
    const oldMetric = metrics[tool] || {};
    const planKey = oldMetric.plan?.toLowerCase().replace(/ /g, '_');
    const oldPrice = audit.pricing_snapshot?.[tool]?.[planKey] || null;
    const newPrice = currentPricing[tool]?.[planKey] || null;

    if (oldPrice !== newPrice) {
      toolChanges.push({
        tool,
        plan: oldMetric.plan,
        oldPrice,
        newPrice
      });
    }
  }

  return {
    oldResult: {
      score: oldScore,
      monthlyCost: oldMonthlyCost,
      recommendation: oldRecommendations.join(', ') || 'None'
    },
    newResult: {
      score: newScore,
      monthlyCost: newMonthlyCost,
      recommendation: newRecommendations.join(', ') || 'None'
    },
    diff: {
      scoreDifference,
      savingsDifference,
      recommendationChanged,
      toolChanges
    }
  };
};
