import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

const APP_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const EMAIL_FROM = process.env.EMAIL_FROM || "Audit AI <noreply@auditai.com>";

/**
 * Send initial audit completion email
 */
export const sendAuditEmail = async ({
  email,
  auditId,
  pdfUrl,
  summary,
  savings,
  score,
  shareToken
}) => {
  try {
    // If we have a shareToken, link directly to the public share route
    const reportUrl = shareToken 
      ? `${APP_URL}/share/${shareToken}`
      : `${APP_URL}/report/${auditId}`;

    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Your AI Audit Report Is Ready",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #111827;">
          <h1 style="color: #1000a9; margin-bottom: 12px;">Audit Completed</h1>
          <p>Your AI stack audit has been generated successfully.</p>
          <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Audit Score:</strong> ${score || "N/A"}</p>
            <p><strong>Estimated Savings:</strong> $${savings || 0}/month</p>
          </div>
          <p>${summary}</p>
          <div style="margin-top: 24px;">
            <a href="${reportUrl}" style="background:#1000a9; color:white; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block; margin-right:12px; font-weight: bold;">
              View Report
            </a>
            ${pdfUrl ? `
              <a href="${pdfUrl}" style="background:#111827; color:white; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block; font-weight: bold;">
                Download PDF
              </a>
            ` : ''}
          </div>
          <p style="margin-top: 32px; color: #6b7280; font-size: 14px;">
            This report can be shared publicly using the shareable URL.
          </p>
        </div>
      `
    });

    console.log(`Audit email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send audit email:", error);
  }
};

/**
 * Send pricing invalidation email
 */
export const sendPricingChangeEmail = async ({
  email,
  audit,
  changesSummary
}) => {
  try {
    const reAuditUrl = `${APP_URL}/re-audit/${audit.id}`;

    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Your AI Audit Needs Revalidation",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #111827;">
          <h1 style="color: #dc2626; margin-bottom: 12px;">Pricing Changes Detected</h1>
          <p>Your audit <strong>${audit.title}</strong> may no longer reflect the latest AI pricing.</p>
          <div style="background:#f4f4f5; padding:16px; border-radius:8px; margin:20px 0; font-family: monospace; white-space: pre-wrap;">
            ${changesSummary}
          </div>
          <p>We recommend re-running your audit to receive updated optimization recommendations.</p>
          <a href="${reAuditUrl}" style="background:#1000a9; color:white; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block; margin-top:16px; font-weight: bold;">
            Re-Run Audit
          </a>
        </div>
      `
    });

    console.log(`Pricing email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send pricing change email:", error);
  }
};
