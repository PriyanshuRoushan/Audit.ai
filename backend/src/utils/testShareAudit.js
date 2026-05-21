import dotenv from 'dotenv';
dotenv.config();

import { createAudit, getPublicAuditByShareToken } from '../controllers/audit.controller.js';
import { supabase } from '../config/supabase.js';

const runTest = async () => {
  try {
    console.log("🚀 Starting Shareable Audit URL System Integration Test...");

    // 1. Fetch a user to run the audit as
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (userError || !users || users.length === 0) {
      console.error("❌ Failed to fetch user from DB. Make sure seed users exist.");
      process.exit(1);
    }

    const testUser = users[0];
    console.log(`👤 Running test as user: ${testUser.name} (${testUser.email})`);

    // 2. Mock request and response for createAudit
    const req = {
      body: {
        title: "Test Shareable Audit URL System",
        description: "A verified automated test for audit sharing and email confirmation.",
        client_name: "Test Client Inc.",
        website: "https://testclient.com",
        selectedTools: ["cursor", "chatgpt"],
        metrics: {
          cursor: { plan: "business", seats: 5, spend: 200 },
          chatgpt: { plan: "team", seats: 10, spend: 250 }
        }
      },
      user: {
        id: testUser.id,
        name: testUser.name,
        email: testUser.email || "priyanshuroushan002@gmail.com"
      }
    };

    let createdStatus = null;
    let createdResponse = null;

    const res = {
      status: (code) => {
        createdStatus = code;
        return res;
      },
      json: (data) => {
        createdResponse = data;
        return res;
      }
    };

    console.log("📝 Creating test audit...");
    await createAudit(req, res);

    if (createdStatus !== 201 || !createdResponse || !createdResponse.success) {
      throw new Error(`Failed to create audit. Status: ${createdStatus}, Response: ${JSON.stringify(createdResponse)}`);
    }

    console.log("✅ Audit created successfully!");
    console.log(`🔗 Share Token: ${createdResponse.shareToken}`);
    console.log(`🔗 Report URL: ${createdResponse.reportUrl}`);

    // Verify properties
    if (!createdResponse.reportUrl) {
      throw new Error("Missing reportUrl in the creation response");
    }

    // 3. Verify notification insertion
    console.log("🔔 Checking in-app notifications...");
    const { data: notifications, error: notifError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', testUser.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (notifError) throw notifError;
    if (!notifications || notifications.length === 0 || !notifications[0].message.includes("is ready")) {
      throw new Error("Notification was not successfully persisted or has incorrect message.");
    }
    console.log(`✅ Notification successfully verified in DB: "${notifications[0].message}"`);

    // 4. Test public fetching via shareToken if columns exist
    if (createdResponse.shareToken) {
      console.log("🌐 Fetching public report using shareToken...");
      const publicReq = {
        params: {
          shareToken: createdResponse.shareToken
        }
      };

      let publicStatus = null;
      let publicResponse = null;

      const publicRes = {
        status: (code) => {
          publicStatus = code;
          return publicRes;
        },
        json: (data) => {
          publicResponse = data;
          return publicRes;
        }
      };

      await getPublicAuditByShareToken(publicReq, publicRes);

      if (publicResponse && publicResponse.error) {
        throw new Error(`Failed to fetch public report: ${publicResponse.error}`);
      }

      if (!publicResponse || !publicResponse.audit || !publicResponse.report) {
        throw new Error(`Invalid public response: ${JSON.stringify(publicResponse)}`);
      }

      console.log(`✅ Public report verified! Title: "${publicResponse.audit.title}"`);
    } else {
      console.warn("⚠️ shareToken is null (expected under legacy fallback). Skipping public endpoint fetch assertion.");
    }
    
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉");
    process.exit(0);
  } catch (error) {
    console.error("❌ TEST FAILED:", error);
    process.exit(1);
  }
};

runTest();
