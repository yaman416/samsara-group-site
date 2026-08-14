import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInviteEmail({
  to,
  clubName,
  code,
  season = 3,
}: {
  to: string;
  clubName: string;
  code: string;
  season?: number;
}) {
  const registerUrl = `https://samsaragroup.com.au/register`;

  const { error } = await resend.emails.send({
    from: "Samsara Premier League <noreply@samsaragroup.com.au>",
    to,
    subject: `Your SPL Season ${season} invitation — ${clubName}`,
    html: `
      <div style="font-family:'DM Sans',system-ui,sans-serif;background:#f4f4f1;padding:40px 0;min-height:100vh">
        <div style="max-width:560px;margin:0 auto;padding:0 24px">
          <div style="background:#101820;border-radius:18px 18px 0 0;padding:32px 36px;text-align:center">
            <div style="font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#98a1ab">Samsara Premier League</div>
            <div style="font-family:Georgia,serif;font-size:28px;color:#fff;margin-top:12px;line-height:1.2">Season ${season} · Club Invitation</div>
          </div>
          <div style="background:#fff;border-radius:0 0 18px 18px;padding:36px;border:1px solid rgba(17,24,39,.10);border-top:none">
            <p style="font-size:17px;line-height:1.7;color:#4a545f;margin:0">
              Hi, your club <strong style="color:#101820">${clubName}</strong> has been invited to compete in the Samsara Premier League Season ${season}.
            </p>
            <p style="font-size:16px;line-height:1.7;color:#66707d;margin:18px 0 0">
              Use the invitation code below to register your club and create your manager account. The code works once, for your club only.
            </p>
            <div style="margin:28px 0;background:#f4f4f1;border-radius:12px;padding:24px;text-align:center">
              <div style="font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#66707d;margin-bottom:12px">Your invitation code</div>
              <div style="font-size:32px;font-weight:700;letter-spacing:.18em;color:#101820;font-family:ui-monospace,monospace">${code}</div>
            </div>
            <div style="text-align:center;margin-top:24px">
              <a href="${registerUrl}" style="display:inline-block;background:#e2372b;color:#fff;font-size:16px;font-weight:500;padding:16px 32px;border-radius:999px;text-decoration:none">Register your club</a>
            </div>
            <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(17,24,39,.08);font-size:14px;line-height:1.65;color:#98a1ab">
              <strong style="color:#66707d">Registration closes 17 October 2026.</strong> After registering, add your squad and submit for committee approval.<br/><br/>
              Questions? Reply to this email or contact <a href="mailto:samsaragroup.cbr@gmail.com" style="color:#e2372b">samsaragroup.cbr@gmail.com</a>
            </div>
          </div>
          <div style="text-align:center;margin-top:24px;font-size:13px;color:#98a1ab">
            © 2026 Samsara Group Canberra · Samsara Premier League
          </div>
        </div>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
}
