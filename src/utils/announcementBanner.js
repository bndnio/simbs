import { RichText } from "prismic-reactjs"

export const ANNOUNCEMENT_BANNER_STORAGE_KEY = "announcement-banner-dismissed"

export const SITE_CHROME_BANNER_ACTIVE_CLASS = "site-chrome--banner-active"
export const SITE_CHROME_BANNER_DISMISS_CLASS = "site-chrome--banner-dismissed"

export function getAnnouncementBannerVersion(banner) {
  if (!banner?.id) return null
  return `${banner.id}:${banner.last_publication_date}`
}

/** Gatsby resolves Prismic link URLs at build time; use `link.url` (see CTA slices). */
export function getAnnouncementBannerHref(link) {
  if (!link?.url || link.isBroken) return null
  return link.url
}

export function isAnnouncementBannerEnabled(banner) {
  if (!banner?.data?.show_banner) return false
  const message = banner.data.message?.raw
  const href = getAnnouncementBannerHref(banner.data.link)
  if (!message || !href) return false
  const text = RichText.asText(message)
  return Boolean(text?.trim())
}
