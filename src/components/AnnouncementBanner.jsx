import React, { forwardRef } from "react"
import { RichText } from "prismic-reactjs"
import {
  getAnnouncementBannerHref,
  getAnnouncementBannerVersion,
  isAnnouncementBannerEnabled,
} from "../utils/announcementBanner"

const AnnouncementBanner = forwardRef(function AnnouncementBanner(
  { banner, dismissed, onDismiss },
  ref
) {
  const versionKey = getAnnouncementBannerVersion(banner)

  if (!isAnnouncementBannerEnabled(banner)) {
    return null
  }

  const { message, link } = banner.data
  const href = getAnnouncementBannerHref(link)

  const handleDismiss = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onDismiss()
  }

  if (dismissed) {
    return (
      <div
        ref={ref}
        id="announcement-banner"
        className="announcement-banner"
        data-version={versionKey}
        hidden
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      ref={ref}
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
        className="announcement-banner-dismiss"
        aria-label="Dismiss announcement"
        onClick={handleDismiss}
      >
        <i className="icon icon-cross" aria-hidden="true" />
      </button>
    </div>
  )
})

export default AnnouncementBanner
