import nodemailer from "nodemailer";

export interface SendFormNotificationParams {
  formType: "contact" | "booking" | "career_application";
  payload: Record<string, unknown>;
}

const FORM_TITLES: Record<SendFormNotificationParams["formType"], string> = {
  booking: "New Booking Reservation - Nomad Bikers Club Website",
  career_application: "New Trainer Career Application - Nomad Bikers Club Website",
  contact: "New Contact Enquiry - Nomad Bikers Club Website",
};

const FIELD_LABELS: Record<string, string> = {
  name: "Full Name",
  email: "Email Address",
  phone: "Phone / Mobile Number",
  city: "City",
  service: "Selected Program",
  comfort: "Comfortable with two-wheelers / cycle?",
  instagram: "Instagram Handle",
  experience: "Geared Bike Experience (Years)",
  message: "Message / Query",
};

const SERVICE_LABELS: Record<string, string> = {
  beginner: "Beginner Training Batch",
  pt: "Scooty / Bike Personal Training",
  regular: "Regular Training Batch",
  getaway: "Getaways",
};

function formatFieldValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (key === "service" && typeof value === "string") {
    return SERVICE_LABELS[value] ?? value;
  }
  if (key === "comfort" && typeof value === "string") {
    return value.toLowerCase() === "yes" ? "Yes" : "No";
  }
  if (key === "experience") {
    return `${value} year(s)`;
  }
  return String(value);
}

/**
 * Creates a reusable nodemailer transporter from environment variables.
 */
function createTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

/**
 * Single reusable email function for all forms.
 */
export async function sendFormNotification({ formType, payload }: SendFormNotificationParams): Promise<{
  sent: boolean;
  messageId?: string;
  skippedReason?: string;
}> {
  const supportEmail = process.env.SUPPORT_EMAIL?.trim() || "rajagowtham8590@gmail.com";
  const subject = FORM_TITLES[formType] || `New Form Submission (${formType}) - Nomad Bikers Club Website`;

  // Find customer's email for Reply-To
  const replyTo = typeof payload.email === "string" && payload.email.includes("@") ? payload.email.trim() : undefined;

  // Build field list for display
  const fieldEntries: Array<{ label: string; value: string }> = Object.entries(payload)
    .filter(([key]) => key !== "website") // Exclude honeypot
    .map(([key, value]) => ({
      label: FIELD_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: formatFieldValue(key, value),
    }));

  // Build plain text version
  const textBody = [
    `NOMAD BIKERS CLUB - WEBSITE NOTIFICATION`,
    `Form: ${FORM_TITLES[formType]}`,
    `Received at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`,
    `----------------------------------------`,
    ...fieldEntries.map((f) => `${f.label}: ${f.value}`),
    `----------------------------------------`,
    replyTo ? `Reply directly to this email to contact the customer (${replyTo}).` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // Build HTML email version
  const tableRowsHtml = fieldEntries
    .map(
      (f) => `
      <tr>
        <td style="padding: 10px 14px; font-weight: 600; color: #374151; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; width: 35%;">${f.label}</td>
        <td style="padding: 10px 14px; color: #111827; border-bottom: 1px solid #e5e7eb;">${escapeHtml(f.value)}</td>
      </tr>`,
    )
    .join("");

  const htmlBody = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(subject)}</title>
    </head>
    <body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <thead>
          <tr>
            <th style="padding: 24px; background: #0f172a; text-align: left;">
              <span style="display: block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #f59e0b; font-weight: 700;">Nomad Bikers Club</span>
              <h1 style="margin: 6px 0 0; font-size: 20px; color: #ffffff; font-weight: 700;">${escapeHtml(FORM_TITLES[formType])}</h1>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 24px;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #4b5563;">
                A new submission was received on your website on <strong>${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</strong>.
              </p>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e5e7eb; border-radius: 8px; border-collapse: separate; overflow: hidden; font-size: 14px;">
                <tbody>
                  ${tableRowsHtml}
                </tbody>
              </table>
              ${
                replyTo
                  ? `<div style="margin-top: 20px; padding: 14px; background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; font-size: 13px; color: #92400e;">
                      <strong>Quick Reply:</strong> You can hit "Reply" in your email client to directly email <strong>${escapeHtml(replyTo)}</strong>.
                    </div>`
                  : ""
              }
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td style="padding: 16px 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
              Nomad Bikers Club Website Notification &bull; Destination: ${escapeHtml(supportEmail)}
            </td>
          </tr>
        </tfoot>
      </table>
    </body>
  </html>
  `;

  const transporter = createTransporter();

  if (!transporter) {
    console.warn(
      `[Email Service] SMTP credentials not set in .env (SMTP_HOST, SMTP_USER, SMTP_PASS). Skipped sending email to ${supportEmail} for "${subject}".`,
    );
    return {
      sent: false,
      skippedReason: "SMTP credentials not configured in .env",
    };
  }

  const from = process.env.SMTP_FROM?.trim() || `"Nomad Bikers Club" <${process.env.SMTP_USER?.trim()}>`;

  try {
    const info = await transporter.sendMail({
      from,
      to: supportEmail,
      replyTo: replyTo || undefined,
      subject,
      text: textBody,
      html: htmlBody,
    });
    console.log(`[Email Service] Email sent successfully to ${supportEmail}. Message ID: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error("[Email Service] Failed to send email notification:", error);
    throw error;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

