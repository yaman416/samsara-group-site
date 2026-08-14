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
    subject: `Congratulations ${clubName}: You're invited to SPL Season ${season}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0efeb;font-family:Arial,system-ui,sans-serif">
<div style="max-width:600px;margin:40px auto;padding:0 20px 40px">

  <!-- Header -->
  <div style="background:#101820;border-radius:20px 20px 0 0;padding:36px 40px;text-align:center">
    <div style="font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#6b7885;margin-bottom:10px">Samsara Premier League</div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:#ffffff;line-height:1.3;margin-bottom:6px">Season ${season} Official Invitation</div>
    <div style="width:48px;height:2px;background:#e2372b;margin:16px auto 0"></div>
  </div>

  <!-- Body -->
  <div style="background:#ffffff;padding:40px;border:1px solid rgba(0,0,0,.08);border-top:none;border-radius:0 0 20px 20px">

    <p style="font-size:20px;font-weight:600;color:#101820;margin:0 0 16px;line-height:1.35">
      Congratulations, ${clubName}!
    </p>

    <p style="font-size:16px;line-height:1.75;color:#4a545f;margin:0 0 18px">
      We are thrilled to officially welcome <strong style="color:#101820">${clubName}</strong> to the Samsara Premier League Season ${season}. Your club's commitment and passion for the game have earned you a place in Canberra's most exciting football competition.
    </p>

    <p style="font-size:16px;line-height:1.75;color:#4a545f;margin:0 0 28px">
      To secure your place, complete your club registration using the exclusive invitation code below. This code is unique to your club and can only be used once.
    </p>

    <!-- Code box -->
    <div style="background:#f0efeb;border-radius:14px;padding:28px;text-align:center;margin-bottom:28px">
      <div style="font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#6b7885;margin-bottom:14px">Your exclusive invitation code</div>
      <div style="font-size:34px;font-weight:700;letter-spacing:6px;color:#101820;font-family:'Courier New',monospace;background:#fff;border:2px solid rgba(0,0,0,.08);border-radius:10px;padding:14px 24px;display:inline-block">${code}</div>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:36px">
      <a href="${registerUrl}" style="display:inline-block;background:#e2372b;color:#ffffff;font-size:16px;font-weight:600;padding:18px 40px;border-radius:999px;text-decoration:none">Register your club now</a>
    </div>

    <!-- Steps -->
    <div style="background:#f8f8f6;border-radius:14px;padding:28px;margin-bottom:28px">
      <div style="font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#6b7885;margin-bottom:20px">How to get started</div>

      <!-- Step 1 -->
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-bottom:18px">
        <tr>
          <td style="width:36px;vertical-align:top;padding-top:2px">
            <div style="width:28px;height:28px;background:#101820;border-radius:50%;color:#fff;font-size:13px;font-weight:700;text-align:center;line-height:28px">1</div>
          </td>
          <td style="padding-left:12px;vertical-align:top">
            <div style="font-size:15px;font-weight:600;color:#101820;margin-bottom:4px">Create your account</div>
            <div style="font-size:14px;line-height:1.65;color:#66707d">Visit <a href="${registerUrl}" style="color:#e2372b;text-decoration:none">samsaragroup.com.au/register</a>, enter your invitation code, and fill in your manager details to create your club account.</div>
          </td>
        </tr>
      </table>

      <!-- Step 2 -->
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-bottom:18px">
        <tr>
          <td style="width:36px;vertical-align:top;padding-top:2px">
            <div style="width:28px;height:28px;background:#101820;border-radius:50%;color:#fff;font-size:13px;font-weight:700;text-align:center;line-height:28px">2</div>
          </td>
          <td style="padding-left:12px;vertical-align:top">
            <div style="font-size:15px;font-weight:600;color:#101820;margin-bottom:4px">Add your squad</div>
            <div style="font-size:14px;line-height:1.65;color:#66707d">Log in to your club portal and add your players, including jersey numbers, positions, and dates of birth. You need at least 11 players to submit.</div>
          </td>
        </tr>
      </table>

      <!-- Step 3 -->
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-bottom:18px">
        <tr>
          <td style="width:36px;vertical-align:top;padding-top:2px">
            <div style="width:28px;height:28px;background:#101820;border-radius:50%;color:#fff;font-size:13px;font-weight:700;text-align:center;line-height:28px">3</div>
          </td>
          <td style="padding-left:12px;vertical-align:top">
            <div style="font-size:15px;font-weight:600;color:#101820;margin-bottom:4px">Set your kit colours</div>
            <div style="font-size:14px;line-height:1.65;color:#66707d">Choose your home and away kit colours in the Kit Colours section of your portal. This helps us manage match day clashes.</div>
          </td>
        </tr>
      </table>

      <!-- Step 4 -->
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
        <tr>
          <td style="width:36px;vertical-align:top;padding-top:2px">
            <div style="width:28px;height:28px;background:#e2372b;border-radius:50%;color:#fff;font-size:13px;font-weight:700;text-align:center;line-height:28px">4</div>
          </td>
          <td style="padding-left:12px;vertical-align:top">
            <div style="font-size:15px;font-weight:600;color:#101820;margin-bottom:4px">Submit for approval</div>
            <div style="font-size:14px;line-height:1.65;color:#66707d">Once your squad and kit are ready, hit Submit for Approval. The committee will review and confirm your registration within a few days.</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Footer note -->
    <div style="font-size:14px;line-height:1.7;color:#98a1ab;padding-top:20px;border-top:1px solid rgba(0,0,0,.07)">
      Questions or need help? Reply to this email or contact us at <a href="mailto:samsaragroup.cbr@gmail.com" style="color:#e2372b;text-decoration:none">samsaragroup.cbr@gmail.com</a>.<br><br>
      We look forward to an incredible season with you on the pitch.
    </div>

  </div>

  <!-- Bottom -->
  <div style="text-align:center;margin-top:24px;font-size:12px;color:#a0a8b0">
    Samsara Premier League · Canberra, Australia<br>
    <a href="https://samsaragroup.com.au" style="color:#a0a8b0">samsaragroup.com.au</a>
  </div>

</div>
</body>
</html>
    `,
  });

  if (error) throw new Error(error.message);
}
