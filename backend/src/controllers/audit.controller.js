import { supabase } from '../config/supabase.js';
import { generateAuditReport } from '../services/ai.service.js';
import { getAiUsageScore } from '../utils/aiUsageScore.js';
import { sendAuditEmail } from '../utils/emailService.js';
import crypto from 'crypto';

export const createAudit = async (req, res) => {
  try {
    const { title, description, client_name, website, type, priority, due_date, selectedTools, metrics } = req.body;
    
    // Auto-generate required fields if they are missing (for the dynamic UI)
    const auditTitle = title || `AI Stack Audit for ${req.user.name || 'Client'}`;
    const auditClientName = client_name || req.user.name || 'Acme Corp';
    
    // Generate secure share token and report URL
    const shareToken = crypto.randomUUID();
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const reportUrl = `${baseUrl}/share/${shareToken}`;

    // 1. Create the Audit record with schema fallback support
    let audit = null;
    let auditError = null;

    const auditDataToInsert = {
      title: auditTitle,
      description: description || 'Automated AI infrastructure configuration audit.',
      client_name: auditClientName,
      website: website || 'unknown',
      type: type || 'AI Infrastructure',
      priority: priority || 'High',
      status: 'In Progress',
      due_date,
      auditor_id: req.user.id,
      share_token: shareToken,
      report_url: reportUrl
    };

    const insertResult = await supabase
      .from('audits')
      .insert([auditDataToInsert])
      .select()
      .single();

    audit = insertResult.data;
    auditError = insertResult.error;

    if (auditError) {
      if (auditError.message?.includes('column') || auditError.message?.includes('schema cache')) {
        console.warn('⚠️ share_token or report_url columns missing in Supabase. Falling back to legacy schema insertion...');
        delete auditDataToInsert.share_token;
        delete auditDataToInsert.report_url;

        const fallbackResult = await supabase
          .from('audits')
          .insert([auditDataToInsert])
          .select()
          .single();

        audit = fallbackResult.data;
        auditError = fallbackResult.error;
      }
    }

    if (auditError) throw auditError;

    // 2. Prepare and save response data
    const responseData = {
      tools: selectedTools || [],
      metrics: metrics || {}
    };

    const { error: responseError } = await supabase
      .from('audit_responses')
      .insert([
        {
          audit_id: audit.id,
          response_data: responseData
        }
      ]);

    if (responseError) throw responseError;

    // 2.5 Generate AI Usage Score based on description / user input
    const userInputPrompt = JSON.stringify(responseData);
    const usageScoreResult = await getAiUsageScore(userInputPrompt);

    // 3. Generate AI Report
    const aiReport = await generateAuditReport({
      website: audit.website,
      responseData,
      aiUsageScore: usageScoreResult.score
    });

    // 4. Save Report to database
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert([
        {
          audit_id: audit.id,
          score: aiReport.score,
          risk_level: aiReport.risk_level,
          summary: aiReport.summary,
          ai_usage_score: aiReport.ai_usage_score,
          issues: aiReport.issues || [],
          recommendations: aiReport.recommendations || [],
          seo_notes: aiReport.seo_notes || '',
          performance_notes: aiReport.performance_notes || ''
        }
      ])
      .select()
      .single();

    if (reportError) throw reportError;

    // 5. Mark Audit as Completed
    await supabase.from('audits').update({ status: 'Completed' }).eq('id', audit.id);

    // 6. Generate savings and trigger email delivery
    const totalSpend = Object.values(metrics || {}).reduce((sum, m) => sum + parseFloat(m.spend || 0), 0);
    const estimatedSavings = Math.round(totalSpend * 0.25); // estimate 25% savings
    const userEmail = req.user?.email || 'priyanshuroushan002@gmail.com'; 
    const pdfUrl = `${baseUrl}/report/${audit.id}/pdf`;

    const finalShareToken = audit.share_token || null;
    const finalReportUrl = audit.report_url || `${baseUrl}/report/${audit.id}`;

    await sendAuditEmail({
      email: userEmail,
      auditId: audit.id,
      pdfUrl,
      summary: aiReport.summary,
      savings: estimatedSavings,
      score: aiReport.score,
      shareToken: finalShareToken
    });

    // 7. Insert Notification into notifications table
    try {
      await supabase.from('notifications').insert([
        {
          user_id: req.user.id,
          message: `Your AI audit report for ${auditTitle} is ready.`,
          is_read: false
        }
      ]);
    } catch (notifErr) {
      console.error('Failed to create in-app notification:', notifErr.message);
    }

    res.status(201).json({ 
      success: true,
      message: 'Audit created and analyzed successfully', 
      auditId: audit.id,
      reportUrl: finalReportUrl,
      shareToken: finalShareToken,
      audit,
      report 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAudits = async (req, res) => {
  try {
    // If admin, can see all. If auditor/client, see only their associated ones
    // For simplicity right now, if not admin, return where auditor_id is user id
    let query = supabase.from('audits').select('*, users(name)');

    if (req.user.role !== 'Admin') {
      query = query.eq('auditor_id', req.user.id);
    }

    const { data: audits, error } = await query;

    if (error) throw error;

    res.json(audits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAuditById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: audit, error } = await supabase
      .from('audits')
      .select('*, users(name)')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json(audit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAuditStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Pending, In Progress, Completed, Rejected

    const { data: audit, error } = await supabase
      .from('audits')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Audit status updated', audit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAudit = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('audits')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Audit deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAuditReport = async (req, res) => {

try {

```
const { id } = req.params;

// 1. Fetch report only
const {
  data: report,
  error: reportError
} = await supabase
  .from('reports')
  .select('*')
  .eq('audit_id', id)
  .single();

if (reportError) {
  console.error(
    'REPORT FETCH ERROR:',
    reportError
  );

  throw reportError;
}

// 2. Fetch audit separately
const {
  data: audit,
  error: auditError
} = await supabase
  .from('audits')
  .select(`
    id,
    title,
    client_name,
    invalidated,
    report_url,
    share_token
  `)
  .eq('id', id)
  .single();

if (auditError) {

  console.error(
    'AUDIT FETCH ERROR:',
    auditError
  );

  throw auditError;
}

// 3. Return merged response
res.json({
  ...report,
  audit
});
```

} catch (error) {

```
console.error(
  'GET REPORT ERROR:',
  error
);

res.status(500).json({
  error: error.message
});
```

}
};


export const getPublicAudit = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .select('*, users(name)')
      .eq('id', id)
      .single();

    if (auditError) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    const { data: report } = await supabase
      .from('reports')
      .select('*')
      .eq('audit_id', id)
      .single();

    const { data: attachments } = await supabase
      .from('attachments')
      .select('*')
      .eq('audit_id', id);

    res.json({
      audit: audit || {},
      report: report || {},
      attachments: attachments || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPublicAuditByShareToken = async (req, res) => {
  try {
    const { shareToken } = req.params;

    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .select('*, users(name)')
      .eq('share_token', shareToken)
      .single();

    if (auditError || !audit) {
    
      return res.status(404).json({ error: 'Audit not found or invalid share token' });
    }

    const { data: report } = await supabase
      .from('reports')
      .select('*')
      .eq('audit_id', audit.id)
      .single();

    const { data: attachments } = await supabase
      .from('attachments')
      .select('*')
      .eq('audit_id', audit.id);

    res.json({
      audit: audit || {},
      report: report || {},
      attachments: attachments || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

