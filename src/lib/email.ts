import { Resend } from 'resend'

const RESEND_KEY = process.env.RESEND_API_KEY ?? ''
const FROM = process.env.EMAIL_FROM ?? 'noreply@resumeforge.app'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://resumeforge.app'

let _resend: Resend | null = null
function getResend(): Resend | null {
  if (!RESEND_KEY) return null
  if (_resend) return _resend
  _resend = new Resend(RESEND_KEY)
  return _resend
}

function shell(content: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>ResumeForge</title></head>
<body style="margin:0;padding:0;background:#f4f3ef;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
<tr><td style="background:#2d5a3d;padding:28px 40px;"><span style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#fff;">ResumeForge</span></td></tr>
<tr><td style="padding:36px 40px;">${content}</td></tr>
<tr><td style="padding:20px 40px 28px;border-top:1px solid #e8e5dd;">
<p style="margin:0;font-size:12px;color:#9a958e;">© ${new Date().getFullYear()} ResumeForge · <a href="${APP_URL}" style="color:#2d5a3d;text-decoration:none;">resumeforge.app</a></p>
</td></tr></table></td></tr></table></body></html>`
}

const h1 = (t: string) => `<h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:26px;font-weight:700;color:#1a1814;">${t}</h1>`
const p = (t: string) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#5a5650;">${t}</p>`
const btn = (text: string, href: string) =>
  `<a href="${href}" style="display:inline-block;background:#2d5a3d;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin-top:20px;">${text}</a>`

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const resend = getResend()
  if (!resend) return
  const firstName = name.split(' ')[0]
  const html = shell(`
    ${h1(`Welcome to ResumeForge, ${firstName}! 👋`)}
    ${p('Your account is ready. Start building a professional, ATS-optimized resume in minutes.')}
    ${p('Here\'s what you can do right now:')}
    <ul style="margin:0 0 20px;padding-left:20px;color:#5a5650;font-size:15px;line-height:2.2;">
      <li>Choose from 10 beautiful resume templates</li>
      <li>Use AI to write your summary and improve bullet points</li>
      <li>Check your ATS score before applying</li>
      <li>Export to PDF or Word with one click</li>
    </ul>
    ${btn('Build My Resume', `${APP_URL}/dashboard`)}
  `)
  await resend.emails.send({
    from: `ResumeForge <${FROM}>`,
    to,
    subject: `Welcome to ResumeForge, ${firstName}!`,
    html,
  })
}

export async function sendPaymentReceiptEmail(
  to: string,
  name: string,
  amountCents: number,
  periodEnd: Date,
): Promise<void> {
  const resend = getResend()
  if (!resend) return
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amountCents / 100)
  const renewsOn = periodEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const html = shell(`
    ${h1('Payment confirmed ✓')}
    ${p(`Thanks ${name.split(' ')[0]}! Your ResumeForge Pro subscription is now active.`)}
    <table style="width:100%;border:1px solid #e8e5dd;border-radius:8px;border-collapse:collapse;margin:20px 0;">
      <tr style="background:#f9f8f5;"><td style="padding:12px 16px;font-size:13px;color:#5a5650;font-weight:600;">Plan</td><td style="padding:12px 16px;font-size:13px;color:#1a1814;font-weight:700;">ResumeForge Pro</td></tr>
      <tr><td style="padding:12px 16px;font-size:13px;color:#5a5650;font-weight:600;">Amount</td><td style="padding:12px 16px;font-size:13px;color:#1a1814;">${formatted}</td></tr>
      <tr style="background:#f9f8f5;"><td style="padding:12px 16px;font-size:13px;color:#5a5650;font-weight:600;">Next renewal</td><td style="padding:12px 16px;font-size:13px;color:#1a1814;">${renewsOn}</td></tr>
    </table>
    ${p('You now have access to all Pro features: unlimited resumes, all templates, unlimited AI calls, and priority support.')}
    ${btn('Go to Dashboard', `${APP_URL}/dashboard`)}
  `)
  await resend.emails.send({
    from: `ResumeForge <${FROM}>`,
    to,
    subject: 'Your ResumeForge Pro subscription is active',
    html,
  })
}

export async function sendCancellationEmail(to: string, name: string, accessUntil: Date): Promise<void> {
  const resend = getResend()
  if (!resend) return
  const until = accessUntil.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const html = shell(`
    ${h1('Subscription cancelled')}
    ${p(`Hi ${name.split(' ')[0]}, we've cancelled your ResumeForge Pro subscription as requested.`)}
    ${p(`You'll keep access to all Pro features until <strong>${until}</strong>. After that, your account will revert to the Free plan.`)}
    ${p('Your resumes and data are safe — nothing is deleted.')}
    ${btn('Reactivate Pro', `${APP_URL}/billing`)}
  `)
  await resend.emails.send({
    from: `ResumeForge <${FROM}>`,
    to,
    subject: 'Your ResumeForge subscription has been cancelled',
    html,
  })
}
