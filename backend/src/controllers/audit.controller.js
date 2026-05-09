import { supabase } from '../config/supabase.js';
import { generateAuditReport } from '../services/ai.service.js';

export const createAudit = async (req, res) => {
  try {
    const { title, description, client_name, website, type, priority, due_date, selectedTools, metrics } = req.body;
    
    // Auto-generate required fields if they are missing (for the dynamic UI)
    const auditTitle = title || `AI Stack Audit for ${req.user.name || 'Client'}`;
    const auditClientName = client_name || req.user.name || 'Acme Corp';
    
    // 1. Create the Audit record
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .insert([
        {
          title: auditTitle,
          description: description || 'Automated AI infrastructure configuration audit.',
          client_name: auditClientName,
          website: website || 'unknown',
          type: type || 'AI Infrastructure',
          priority: priority || 'High',
          status: 'In Progress',
          due_date,
          auditor_id: req.user.id
        }
      ])
      .select()
      .single();

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

    // 3. Generate AI Report
    const aiReport = await generateAuditReport(responseData);

    // 4. Save Report to database
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert([
        {
          audit_id: audit.id,
          score: aiReport.score,
          risk_level: aiReport.risk_level,
          summary: aiReport.summary,
          recommendations: aiReport.recommendations
        }
      ])
      .select()
      .single();

    if (reportError) throw reportError;

    // 5. Mark Audit as Completed
    await supabase.from('audits').update({ status: 'Completed' }).eq('id', audit.id);

    res.status(201).json({ 
      message: 'Audit created and analyzed successfully', 
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
    const { id } = req.params;

    const { data: report, error } = await supabase
      .from('reports')
      .select('*, audits(title, client_name)')
      .eq('audit_id', id)
      .single();

    if (error) throw error;

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
