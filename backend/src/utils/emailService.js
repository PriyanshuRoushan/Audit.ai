import { Resend } from "resend";
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export const sendAuditEmail = async (email, reportUrl, pdfUrl, summary) => {
  try {
    await resend.emails.send({
      from: "Audit AI <noreply@auditai.com>",
      to: email,
      subject: "Your AI Audit Report is Ready",
      html: `
        <h2>Audit Completed</h2>
        <p>${summary}</p>
        <a href="${reportUrl}">View Report</a><br/>
        <a href="${pdfUrl}">Download PDF</a>
      `
    });
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error('Failed to send audit email via Resend:', error);
  }
};

export const sendPricingChangeEmail = async (email, audit, changesSummary) => {
  try {
    const appUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const reAuditUrl = `${appUrl}/re-audit/${audit.id}`;

    await resend.emails.send({
      from: "Audit AI <noreply@auditai.com>",
      to: email,
      subject: "Your AI Audit Needs Revalidation",
      html: `
        <h2>AI Audit Revalidation Required</h2>
        <p>Dear Customer,</p>
        <p>We detected pricing changes on tools used in your audit <strong>"${audit.title}"</strong>:</p>
        <pre style="background: #f4f4f4; padding: 12px; border-radius: 6px; font-family: monospace;">${changesSummary}</pre>
        <p>Your previous recommendations may no longer be cost-optimal under the new pricing.</p>
        <br/>
        <a href="${reAuditUrl}" style="background: #1000a9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Re-Run Audit</a>
      `
    });
    console.log(`Pricing change email sent successfully to ${email}`);
  } catch (error) {
    console.error('Failed to send pricing change email:', error);
  }
};

