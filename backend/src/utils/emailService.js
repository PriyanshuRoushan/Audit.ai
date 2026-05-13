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
