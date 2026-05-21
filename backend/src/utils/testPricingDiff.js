import { detectPricingChanges } from '../services/pricingDiff.service.js';

const mockOldSnapshot = {
  cursor: {
    free: 0,
    pro: 18,        // Changed: Current pro is 20
    business: 40
  },
  chatgpt: {
    free: 0,
    plus: 20,
    team: 30,
    enterprise: 60  // Removed: Current chatgpt does not have enterprise
  },
  // Added plan: gemini has advanced: 20 in current, but not here
  gemini: {
    free: 0
  }
};

const runTest = async () => {
  try {
    console.log("Running Pricing Change Detection Test...");
    const result = await detectPricingChanges(mockOldSnapshot);
    console.log("Test Result:", JSON.stringify(result, null, 2));

    // Assertions
    const cursorProChange = result.changes.find(c => c.tool === 'cursor' && c.plan === 'pro');
    if (!cursorProChange || cursorProChange.newPrice !== 20 || cursorProChange.oldPrice !== 18 || cursorProChange.difference !== 2) {
      throw new Error("Failed to detect changed price for Cursor Pro");
    }
    console.log("✅ Successfully detected changed price for Cursor Pro");

    const chatgptEnterpriseChange = result.changes.find(c => c.tool === 'chatgpt' && c.plan === 'enterprise');
    if (!chatgptEnterpriseChange || chatgptEnterpriseChange.newPrice !== null || chatgptEnterpriseChange.oldPrice !== 60 || chatgptEnterpriseChange.difference !== -60) {
      throw new Error("Failed to detect removed plan for ChatGPT Enterprise");
    }
    console.log("✅ Successfully detected removed plan for ChatGPT Enterprise");

    const geminiAdvancedChange = result.changes.find(c => c.tool === 'gemini' && c.plan === 'advanced');
    if (!geminiAdvancedChange || geminiAdvancedChange.newPrice !== 20 || geminiAdvancedChange.oldPrice !== null || geminiAdvancedChange.difference !== 20) {
      throw new Error("Failed to detect added plan for Gemini Advanced");
    }
    console.log("✅ Successfully detected added plan for Gemini Advanced");

    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉");
  } catch (error) {
    console.error("❌ TEST FAILED:", error);
    process.exit(1);
  }
};

runTest();
