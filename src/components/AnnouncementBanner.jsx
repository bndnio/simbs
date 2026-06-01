import React, { useState } from "react"
import { Link as PrismicLink, RichText } from "prismic-reactjs"
import linkResolver from "../utils/linkResolver"

export const STORAGE_KEY = "announcement-banner-dismissed"
export const DISMISS_CLASS = "announcement-banner-dismissed"
export const ACTIVE_CLASS = "announcement-banner-active"

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

function isDismissed(versionKey) {
  if (!versionKey) return true
  if (typeof window === "undefined") return false
  try {
    if (document.documentElement.classList.contains(DISMISS_CLASS)) {
      return true
    }
    return sessionStorage.getItem(STORAGE_KEY) === versionKey
  } catch {
    return false
  }
}

function dismissAnnouncement(versionKey) {
  try {
    sessionStorage.setItem(STORAGE_KEY, versionKey)
  } catch {
    // sessionStorage unavailable
  }
  document.documentElement.classList.add(DISMISS_CLASS)
}

export default function AnnouncementBanner({ banner }) {
  const versionKey = getAnnouncementBannerVersion(banner)

  if (!isAnnouncementBannerEnabled(banner)) {
    return null
  }

  const { message, link } = banner.data
  const href = PrismicLink.url(link, linkResolver)
  const [dismissed, setDismissed] = useState(() => isDismissed(versionKey))

  if (dismissed) {
    return (
      <div
        id="announcement-banner"
        className="announcement-banner"
        data-version={versionKey}
        hidden
        aria-hidden="true"
      />
    )
  }

  const handleDismiss = (event) => {
    event.preventDefault()
    event.stopPropagation()
    dismissAnnouncement(versionKey)
    setDismissed(true)
  }

  return (
    <div
      id="announcement-banner"
      className="announcement-banner"
      data-version={versionKey}
    >
      <a
        className="announcement-banner-link"
        href={href}
        target={link.target}
        rel="noopener noreferrer"
      >
        <span className="announcement-banner-message">
          {RichText.render(message.raw)}
        </span>
      </a>
      <button
        type="button"
        className="announcement-banner-dismiss btn btn-clear"
        aria-label="Dismiss announcement"
        onClick={handleDismiss}
      >
        <i className="icon icon-cross" />
      </button>
    </div>
  )
}
