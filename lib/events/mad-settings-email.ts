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
  firstNameOf,
  tribeBadgeAlt,
  type Tribe,
} from '@/lib/events/mad-settings-tribes'

export const EMAIL_SITE_URL = 'https://www.campingnigeria.com'

/** Shown at this width in the email; height keeps the artwork's ratio. */
const BADGE_WIDTH = 220
/** Two badges side by side for a couple, each narrower. */
const COUPLE_BADGE_WIDTH = 190

/** A couple's second person: their name from the form (may be blank) and tribe. */
export interface CouplePartner {
  name: string
  tribe: Tribe
}

function badgeImg(tribe: Tribe, width: number): string {
  const height = Math.round((width * tribe.imageHeight) / tribe.imageWidth)
  return `<img src="${EMAIL_SITE_URL}${tribe.image}" width="${width}" height="${height}" alt="${escapeHtml(tribeBadgeAlt(tribe))}" style="display:block;margin:10px auto 10px;width:${width}px;height:${height}px;border:0;">`
}

function tribePill(tribe: Tribe): string {
  return `<span style="display:inline-block;background-color:${tribe.colour};color:${tribe.ink};font-size:15px;font-weight:700;letter-spacing:1px;padding:5px 16px;border-radius:999px;">${escapeHtml(tribe.name)}</span>`
}

/**
 * The tribe box. With `partner` (a couple ticket) it shows both people's
 * tribes, which are always different, side by side and named.
 */
export function tribeBlockHtml(tribe: Tribe, opts: { guestName?: string; partner?: CouplePartner } = {}): string {
  if (opts.partner) return coupleTribeBlockHtml(tribe, opts.guestName ?? '', opts.partner)
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

function coupleTribeBlockHtml(tribe: Tribe, guestName: string, partner: CouplePartner): string {
  const you = escapeHtml(firstNameOf(guestName) || 'You')
  const them = escapeHtml(firstNameOf(partner.name) || 'Your partner')
  const cell = (who: string, t: Tribe) => `<td width="50%" valign="top" align="center" style="padding:8px 6px;">
          <p style="margin:0;font-size:13px;font-weight:700;color:#0e3e2e;">${who}</p>
          ${badgeImg(t, COUPLE_BADGE_WIDTH)}
          ${tribePill(t)}
        </td>`
  const theirClause = partner.name.trim()
    ? `<strong>${them}</strong> is in <strong>${escapeHtml(partner.tribe.name)}</strong>`
    : `your partner is in <strong>${escapeHtml(partner.tribe.name)}</strong>`
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:28px;">
      <tr><td style="background-color:#ffffff;padding:20px 14px;" align="center">
        <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">Your tribes</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        ${cell(you, tribe)}
        ${cell(them, partner.tribe)}
        </tr></table>
        <p style="margin:12px 0 0;font-size:14px;color:#3d3d3d;line-height:1.6;">You are in <strong>${escapeHtml(tribe.name)}</strong> and ${theirClause}: on a couple ticket, each of you belongs to a different tribe.</p>
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
  /** Couple tickets: the second person, whose tribe differs from the guest's. */
  partner?: CouplePartner
}

export function tribeAnnouncementSubject(tribe: Tribe, partner?: CouplePartner): string {
  return partner
    ? `Your ${EVENT_FULL_TITLE} tribes: ${tribe.name} and ${partner.tribe.name}`
    : `Your ${EVENT_FULL_TITLE} tribe: ${tribe.name}`
}

/**
 * The one-off email to guests who signed up before tribes existed (sent by
 * scripts/send-tribe-emails.ts). Their confirmation email still stands — gate
 * pass, venue and lists — so this one carries only what is new: the tribe and
 * the social link, plus their code so they can match it to that email.
 */
export function buildTribeAnnouncementEmail(
  guest: TribeAnnouncementGuest,
  tribe: Tribe,
  opts: { coupleUpdate?: boolean } = {},
): string {
  const firstName = escapeHtml(firstNameOf(guest.name) || 'there')
  const intro = opts.coupleUpdate
    ? 'One change since our last email: on a couple ticket, the two of you now belong to different tribes. Here are both.'
    : `Every ${escapeHtml(EVENT_FULL_TITLE)} guest now belongs to one of four tribes. ${guest.partner ? 'Here are yours: one each.' : 'Here is yours.'}`
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3efe6;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3efe6;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background-color:#0e3e2e;padding:28px 40px;border-radius:12px 12px 0 0;" align="center">
    <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">Meet your ${guest.partner ? 'tribes' : 'tribe'}, ${firstName}</h1>
    <p style="margin:8px 0 0;font-size:13px;color:#e6b325;text-transform:uppercase;letter-spacing:2px;">${escapeHtml(EVENT_FULL_TITLE)} &middot; ${escapeHtml(EVENT_DATE_LABEL)}</p>
  </td></tr>

  <tr><td style="background-color:#ffffff;padding:32px 40px;">

    <p style="margin:0 0 24px;font-size:15px;color:#3d3d3d;line-height:1.6;">
      ${intro}
    </p>

    ${tribeBlockHtml(tribe, { guestName: guest.name, partner: guest.partner })}

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
