/**
 * Email fragments shared by the MAD Settings confirmation email
 * (`app/api/mad-settings-signup/route.ts`) and the one-off tribe email to
 * guests who signed up before tribes existed (`scripts/send-tribe-emails.ts`),
 * so the two cannot drift.
 *
 * The badge is a hosted image rather than an inline attachment: it is the
 * same four files for everyone, and the tribe name is also set as text in
 * the tribe's colour, so a mail client that hides images still says it.
 */

import { CONTACT } from '@/lib/constants'
import { escapeHtml } from '@/lib/html'
import {
  EVENT_DATE_LABEL,
  EVENT_FULL_TITLE,
  EVENT_PATH,
  EVENT_PHONE_DISPLAY,
  EVENT_PHONE_TEL,
} from '@/lib/events/mad-settings'
import {
  SOCIAL_LINE_AFTER,
  SOCIAL_LINE_BEFORE,
  SOCIAL_URL,
  tribeBadgeAlt,
  type Tribe,
} from '@/lib/events/mad-settings-tribes'

export const EMAIL_SITE_URL = 'https://www.campingnigeria.com'

/** Shown at this width in the email; height keeps the artwork's ratio. */
const BADGE_WIDTH = 220

export function tribeBlockHtml(tribe: Tribe): string {
  const height = Math.round((BADGE_WIDTH * tribe.imageHeight) / tribe.imageWidth)
  const name = escapeHtml(tribe.name)
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid ${tribe.colour};border-radius:10px;overflow:hidden;margin-bottom:28px;">
      <tr><td style="background-color:#ffffff;padding:20px;" align="center">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">Your tribe</p>
        <img src="${EMAIL_SITE_URL}${tribe.image}" width="${BADGE_WIDTH}" height="${height}" alt="${escapeHtml(tribeBadgeAlt(tribe))}" style="display:block;margin:14px auto 12px;width:${BADGE_WIDTH}px;height:${height}px;border:0;">
        <p style="margin:0 0 10px;"><span style="display:inline-block;background-color:${tribe.colour};color:${tribe.ink};font-size:16px;font-weight:700;letter-spacing:1px;padding:6px 18px;border-radius:999px;">${name}</span></p>
        <p style="margin:0;font-size:14px;color:#3d3d3d;line-height:1.6;">You are in <strong>${name}</strong>, one of the four MAD Settings tribes.</p>
      </td></tr>
    </table>`
}

export function socialBlockHtml(): string {
  const url = escapeHtml(SOCIAL_URL)
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background-color:#fdf6e3;border:1px solid #e6b325;border-radius:10px;">
      <tr><td style="padding:16px 20px;font-size:14px;color:#0e3e2e;line-height:1.6;" align="center">
        ${escapeHtml(SOCIAL_LINE_BEFORE)}<a href="${url}" style="color:#b8880a;font-weight:700;text-decoration:underline;">${url}</a>${escapeHtml(SOCIAL_LINE_AFTER)}
      </td></tr>
    </table>`
}

export interface TribeAnnouncementGuest {
  name: string
  code: string
}

export function tribeAnnouncementSubject(tribe: Tribe): string {
  return `Your ${EVENT_FULL_TITLE} tribe: ${tribe.name}`
}

/**
 * The one-off email to guests who signed up before tribes existed (sent by
 * scripts/send-tribe-emails.ts). Their confirmation email still stands — gate
 * pass, venue and lists — so this one carries only what is new: the tribe and
 * the social link, plus their code so they can match it to that email.
 */
export function buildTribeAnnouncementEmail(guest: TribeAnnouncementGuest, tribe: Tribe): string {
  const firstName = escapeHtml(guest.name.trim().split(/s+/)[0] || 'there')
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3efe6;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3efe6;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background-color:#0e3e2e;padding:28px 40px;border-radius:12px 12px 0 0;" align="center">
    <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">Meet your tribe, ${firstName}</h1>
    <p style="margin:8px 0 0;font-size:13px;color:#e6b325;text-transform:uppercase;letter-spacing:2px;">${escapeHtml(EVENT_FULL_TITLE)} &middot; ${escapeHtml(EVENT_DATE_LABEL)}</p>
  </td></tr>

  <tr><td style="background-color:#ffffff;padding:32px 40px;">

    <p style="margin:0 0 24px;font-size:15px;color:#3d3d3d;line-height:1.6;">
      Every ${escapeHtml(EVENT_FULL_TITLE)} guest now belongs to one of four tribes. Here is yours.
    </p>

    ${tribeBlockHtml(tribe)}

    <p style="margin:0;font-size:14px;color:#3d3d3d;line-height:1.6;">
      Nothing else changes. Your code is still
      <strong style="font-family:monospace;letter-spacing:1px;">${escapeHtml(guest.code)}</strong>,
      and the gate pass in your first email works as before.
    </p>

    ${socialBlockHtml()}

    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">

    <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
      Questions before the day? Reply to this email, or call the MAD Settings line on
      <a href="${EVENT_PHONE_TEL}" style="color:#0e3e2e;font-weight:600;text-decoration:none;">${escapeHtml(EVENT_PHONE_DISPLAY)}</a>.
    </p>

  </td></tr>

  <tr><td style="background-color:#0e3e2e;padding:24px 40px;border-radius:0 0 12px 12px;" align="center">
    <p style="margin:0 0 8px;font-size:13px;color:#ffffff99;">
      <a href="${EMAIL_SITE_URL}${EVENT_PATH}" style="color:#e6b325;text-decoration:none;font-weight:600;">campingnigeria.com</a>
    </p>
    <p style="margin:0;font-size:11px;color:#ffffff50;">
      <a href="${escapeHtml(CONTACT.instagram)}" style="color:#ffffff70;text-decoration:none;">Instagram</a>
      &nbsp;&middot;&nbsp;
      <a href="${escapeHtml(CONTACT.facebook)}" style="color:#ffffff70;text-decoration:none;">Facebook</a>
      &nbsp;&middot;&nbsp;
      <a href="${escapeHtml(CONTACT.whatsapp)}" style="color:#ffffff70;text-decoration:none;">WhatsApp</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
