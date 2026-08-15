import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "Samsara Premier League <noreply@samsarapl.com.au>";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samsaragroup.com.au";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  return resend.emails.send({ from: FROM, to, subject, html });
}

export function unsubscribeUrl(token: string) {
  return `${SITE}/api/unsubscribe?token=${token}`;
}

export async function sendInviteEmail({ to, clubName, code, season }: { to: string; clubName: string; code: string; season: number }) {
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samsaragroup.com.au";
  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111;">
<h2>Samsara Premier League: Club Registration</h2>
<p>You have been invited to register <strong>${clubName}</strong> for Season ${season}.</p>
<p>Your registration code: <strong style="font-size:20px;letter-spacing:0.1em;">${code}</strong></p>
<p><a href="${SITE}/register?code=${code}" style="display:inline-block;background:#18212a;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Register now</a></p>
<p style="font-size:12px;color:#888;margin-top:24px;">If you did not expect this email, you can ignore it.</p>
</body></html>`;
  return sendEmail({ to, subject: `SPL Season ${season}: Your club registration code`, html });
}

export function wrapEmail(title: string, body: string, unsubToken?: string) {
  const footer = unsubToken
    ? `<p style="font-size:12px;color:#888;margin-top:32px;">You're receiving this because you subscribed to Samsara Premier League updates. <a href="${unsubscribeUrl(unsubToken)}" style="color:#888;">Unsubscribe</a></p>`
    : "";
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111;">
<h1 style="font-size:22px;font-weight:700;margin-bottom:4px;">Samsara Premier League</h1>
<h2 style="font-size:18px;font-weight:600;color:#1a56db;margin-top:0;">${title}</h2>
<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
${body}
${footer}
</body></html>`;
}
