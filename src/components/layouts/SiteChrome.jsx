import React from "react"
import AnnouncementBanner from "../AnnouncementBanner"
import { useSiteChrome } from "../../hooks/useSiteChrome"
import {
  SITE_CHROME_BANNER_ACTIVE_CLASS,
  SITE_CHROME_BANNER_DISMISS_CLASS,
} from "../../utils/announcementBanner"
import Nav from "./Nav"

export default function SiteChrome({ banner, clearNav }) {
  const {
    bannerEnabled,
    versionKey,
    dismissed,
    dismissBanner,
    bannerRef,
    navbarTop,
  } = useSiteChrome(banner)
  const className = [
    "site-chrome",
    bannerEnabled && SITE_CHROME_BANNER_ACTIVE_CLASS,
    bannerEnabled && dismissed && SITE_CHROME_BANNER_DISMISS_CLASS,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      className={className}
      {...(bannerEnabled && versionKey
        ? { "data-announcement-version": versionKey }
        : {})}
    >
      <AnnouncementBanner
        ref={bannerRef}
        banner={banner}
        dismissed={dismissed}
        onDismiss={dismissBanner}
      />
      <Nav clearNav={clearNav} navbarTop={navbarTop} />
    </div>
  )
}
