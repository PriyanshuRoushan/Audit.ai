const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const FALLBACK_PRICING = {
  cursor: {
    free: 0,
    pro: 20,
    business: 40
  },
  chatgpt: {
    free: 0,
    plus: 20,
    team: 30
  },
  claude: {
    free: 0,
    pro: 20,
    team: 30
  },
  github_copilot: {
    individual: 10,
    business: 19,
    enterprise: 39
  },
  gemini: {
    free: 0,
    advanced: 20
  },
  openai_api: {
    gpt4_input_per_1m: 10,
    gpt4_output_per_1m: 30,
    gpt35_input_per_1m: 0.5,
    gpt35_output_per_1m: 1.5
  },
  anthropic_api: {
    claude_opus_input_per_1m: 15,
    claude_opus_output_per_1m: 75,
    claude_sonnet_input_per_1m: 3,
    claude_sonnet_output_per_1m: 15
  },
  windsurf: {
    free: 0,
    pro: 15,
    team: 30
  }
};

export const fetchPricing = async () => {
  const response = await fetch(`${API}/api/pricing`);
  if (!response.ok) {
    throw new Error('Failed to fetch pricing data');
  }
  return response.json();
};

export const formatPlanName = (planKey) => {
  return planKey
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};
