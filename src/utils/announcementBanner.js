import { Link as PrismicLink, RichText } from "prismic-reactjs"
import linkResolver from "./linkResolver"

export const ANNOUNCEMENT_BANNER_STORAGE_KEY = "announcement-banner-dismissed"

export const SITE_CHROME_BANNER_ACTIVE_CLASS = "site-chrome--banner-active"
export const SITE_CHROME_BANNER_DISMISS_CLASS = "site-chrome--banner-dismissed"

export function getAnnouncementBannerVersion(banner) {
  if (!banner?.id) return null
  return `${banner.id}:${banner.last_publication_date}`
}

export function isAnnouncementBannerEnabled(banner) {
  if (!banner?.data?.show_banner) return false
  const message = banner.data.message?.raw
  const link = banner.data.link
  const href = PrismicLink.url(link, linkResolver)
  if (!message || !href) return false
  const text = RichText.asText(message)
  return Boolean(text?.trim())
}
