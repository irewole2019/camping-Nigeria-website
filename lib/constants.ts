/** Re-exported from the centralized media registry */
export { MEDIA_LOGO as LOGO_URL, MEDIA_VIDEO as VIDEO_URL } from './media'

/** Company contact info */
export const CONTACT = {
  email: 'hello@campingnigeria.com',
  phone: '+234 704 053 8528',
  whatsapp: 'https://wa.me/2347040538528',
  instagram: 'https://www.instagram.com/camping_ng/',
  facebook: 'https://www.facebook.com/campinggearsng',
  address: {
    streetAddress: '198 Damboa Close, PW',
    locality: 'Kubwa',
    city: 'Abuja',
    region: 'FCT',
    country: 'NG',
    formatted: '198 Damboa Close, PW, Kubwa, Abuja',
  },
} as const

/** Outlook Bookings "Book With Me" scheduling link (cannot be iframe-embedded — open in new tab) */
export const CALENDAR_BOOKING_URL =
  'https://outlook.office.com/bookwithme/user/af37a0b6a8bd421baee86c4284a1791b@campingnigeria.com/meetingtype/XKVSQzWp00OYaRlYcFPsjg2?anonymous&ismsaljsauthenabled&ep=mlink'
