/** Re-exported from the centralized media registry */
export { MEDIA_LOGO as LOGO_URL, MEDIA_VIDEO as VIDEO_URL } from './media'

/** Company contact info */
export const CONTACT = {
  email: 'hello@campingnigeria.com',
  phone: '+234 814 607 5937',
  whatsapp: 'https://wa.me/2348146075937',
  instagram: 'https://www.instagram.com/camping_ng/',
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

/** Outlook Bookings "Book With Me" scheduling link (cannot be iframe-embedded — open in new tab) */
export const CALENDAR_BOOKING_URL =
  'https://outlook.office.com/bookwithme/user/af37a0b6a8bd421baee86c4284a1791b@campingnigeria.com/meetingtype/XKVSQzWp00OYaRlYcFPsjg2?anonymous&ismsaljsauthenabled&ep=mlink'
