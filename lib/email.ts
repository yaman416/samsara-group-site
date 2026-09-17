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
  const replyTo = process.env.EMAIL_REPLY_TO ?? undefined;
  return resend.emails.send({ from: FROM, to, subject, html, ...(replyTo ? { replyTo } : {}) });
}

export function unsubscribeUrl(token: string) {
  return `${SITE}/api/unsubscribe?token=${token}`;
}

export async function sendInviteEmail({ to, clubName, code, season }: { to: string; clubName: string; code: string; season: number }) {
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samsaragroup.com.au";
  const registerUrl = `${SITE}/register?code=${code}`;
  const html = `<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#101820;background:#fff;">
  <div style="margin-bottom:24px;">
    <div style="font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#e2372b;margin-bottom:8px;">Samsara Premier League</div>
    <h1 style="font-size:26px;font-weight:700;margin:0 0 8px;">Season ${season} Invitation</h1>
    <p style="margin:0;color:#4a545f;font-size:15px;">You have been invited to register <strong>${clubName}</strong> for Season ${season}.</p>
  </div>

  <div style="background:#f4f4f1;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
    <div style="font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#66707d;margin-bottom:8px;">Your registration code</div>
    <div style="font-size:28px;font-weight:700;letter-spacing:.12em;font-family:ui-monospace,monospace;color:#101820;">${code}</div>
  </div>

  <div style="margin-bottom:28px;">
    <div style="font-size:14px;font-weight:600;margin-bottom:16px;color:#101820;">How to register your club:</div>
    <table style="border-collapse:collapse;width:100%;">
      <tr>
        <td style="vertical-align:top;padding:0 16px 16px 0;width:32px;">
          <div style="width:28px;height:28px;border-radius:50%;background:#101820;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;text-align:center;line-height:28px;">1</div>
        </td>
        <td style="padding-bottom:16px;vertical-align:top;">
          <div style="font-weight:600;font-size:14px;margin-bottom:3px;">Go to the registration page</div>
          <div style="font-size:13px;color:#66707d;">Visit <a href="${registerUrl}" style="color:#1a56db;">${SITE}/register</a> or click the button below.</div>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:top;padding:0 16px 16px 0;">
          <div style="width:28px;height:28px;border-radius:50%;background:#101820;color:#fff;font-size:13px;font-weight:700;text-align:center;line-height:28px;">2</div>
        </td>
        <td style="padding-bottom:16px;vertical-align:top;">
          <div style="font-weight:600;font-size:14px;margin-bottom:3px;">Enter your code</div>
          <div style="font-size:13px;color:#66707d;">Paste the code above when prompted. This links your account to <strong>${clubName}</strong>.</div>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:top;padding:0 16px 16px 0;">
          <div style="width:28px;height:28px;border-radius:50%;background:#101820;color:#fff;font-size:13px;font-weight:700;text-align:center;line-height:28px;">3</div>
        </td>
        <td style="padding-bottom:16px;vertical-align:top;">
          <div style="font-weight:600;font-size:14px;margin-bottom:3px;">Create your manager account</div>
          <div style="font-size:13px;color:#66707d;">Sign up with your email address. Your account becomes the club manager for ${clubName}.</div>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:top;padding:0 16px 0 0;">
          <div style="width:28px;height:28px;border-radius:50%;background:#101820;color:#fff;font-size:13px;font-weight:700;text-align:center;line-height:28px;">4</div>
        </td>
        <td style="vertical-align:top;">
          <div style="font-weight:600;font-size:14px;margin-bottom:3px;">Submit your squad</div>
          <div style="font-size:13px;color:#66707d;">Add your players (name, jersey number, position) before the squad registration deadline. The league admin will approve your submission.</div>
        </td>
      </tr>
    </table>
  </div>

  <a href="${registerUrl}" style="display:inline-block;background:#101820;color:#fff;padding:13px 28px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;margin-bottom:28px;">Register ${clubName}</a>

  <hr style="border:none;border-top:1px solid rgba(17,24,39,.10);margin:0 0 20px;">
  <p style="font-size:12px;color:#98a1ab;margin:0;">Samsara Premier League, Canberra. If you did not expect this email, you can ignore it. Questions? Reply to this email.</p>
</body>
</html>`;
  return sendEmail({ to, subject: `SPL Season ${season}: Club registration invite for ${clubName}`, html });
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
