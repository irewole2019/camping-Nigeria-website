/** Re-exported from the centralized media registry */
export { MEDIA_LOGO as LOGO_URL, MEDIA_VIDEO as VIDEO_URL } from './media'

/** Company contact info */
export const CONTACT = {
  email: 'hello@campingnigeria.com',
  phone: '+234 903 404 2503',
  /**
   * WhatsApp "click to chat" short link from the business QR code — opaque,
   * not derived from `phone`. Don't rebuild it as `wa.me/<digits>`; the two
   * are independent and the number can change without invalidating this link.
   */
  whatsapp: 'https://wa.me/message/4NX4VTGXCP4UE1?src=qr',
  instagram: 'https://www.instagram.com/campingnigeria/',
  facebook: 'https://www.facebook.com/campinggearsng',
  address: {
    streetAddress: 'Shop No. 17A, Arts and Craft Village, Sani Abacha Way',
    locality: 'Wuse',
    city: 'Abuja',
    region: 'FCT',
    postalCode: '904101',
    country: 'NG',
    formatted: 'Shop No. 17A, Arts and Craft Village, Sani Abacha Way, Wuse, Abuja 904101',
  },
} as const

/** Microsoft Forms booking form for individual trip seats — always link out */
export const BOOKING_FORM_URL = 'https://forms.office.com/r/bgsZ4shNxD'

/** Outlook Bookings "Book With Me" scheduling link (cannot be iframe-embedded — open in new tab) */
export const CALENDAR_BOOKING_URL =
  'https://outlook.office.com/bookwithme/user/af37a0b6a8bd421baee86c4284a1791b@campingnigeria.com/meetingtype/XKVSQzWp00OYaRlYcFPsjg2?anonymous&ismsaljsauthenabled&ep=mlink'
