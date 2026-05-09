import { supabase } from '../config/supabase.js';
import { generateAuditReport } from '../services/ai.service.js';

export const createForm = async (req, res) => {
  try {
    const { name, description, fields } = req.body;
    
    const { data: form, error } = await supabase
      .from('audit_forms')
      .insert([{ name, description, fields }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Form created', form });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getForms = async (req, res) => {
  try {
    const { data: forms, error } = await supabase.from('audit_forms').select('*');
    if (error) throw error;
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const submitResponse = async (req, res) => {
  try {
    const { audit_id, form_id, response_data } = req.body;

    const { data: response, error } = await supabase
      .from('audit_responses')
      .insert([{ audit_id, form_id, response_data }])
      .select()
      .single();

    if (error) throw error;

    // Trigger AI Analysis automatically
    const aiReport = await generateAuditReport(response_data);

    // Save AI Report to reports table
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert([{
        audit_id,
        score: aiReport.score,
        risk_level: aiReport.risk_level,
        summary: aiReport.summary,
        recommendations: aiReport.recommendations
      }])
      .select()
      .single();

    if (reportError) throw reportError;

    // Update audit status to Completed
    await supabase.from('audits').update({ status: 'Completed' }).eq('id', audit_id);

    res.status(201).json({ 
      message: 'Response submitted and AI Report generated', 
      response, 
      report 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReport = async (req, res) => {
  try {
    const { audit_id } = req.params;

    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('audit_id', audit_id)
      .single();

    if (error) throw error;

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
